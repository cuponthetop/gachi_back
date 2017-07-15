import morgan from 'morgan';
import { loggers, transports } from 'winston';
import * as _ from 'lodash';
import { getHTTPTransport, getConsoleTransport } from './get-transport';

/**
 * <p>모듈(moduleName)에 대한 LoggerInstance를 리턴하며,<br/>
 * 해당 모듈에 대한 LoggerInstance가 존재하지 않다면 새로 생성하여 이를 리턴한다.</p>
 *
 * @param  {string} moduleName 모듈 이름
 * @param  {any} httpOpts 로그 서버의 host, port, uri가 정의된 객체
 * @returns {LoggerInstance} 모듈에 대한 LoggerInstance
 */
export function getLogger(moduleName, httpOpts) {
  let logger = null;

  if (false === loggers.has(moduleName)) {
    let transports = [];
    let console = getConsoleTransport(moduleName);
    transports.push(console);
  	if (true === _.get(httpOpts, 'isHTTP', false)) {
      let http = getHTTPTransport(moduleName, httpOpts);
      transports.push(http);
    }

    logger = loggers.add(moduleName, {
      transports: transports
    });
  } else {
    logger = loggers.get(moduleName);
  }

  return logger;
}

/**
 * Generate stream object which can be used by morgan to print out it's logs
 */
function generateStream(logger, level) {
  return {
    write: (message)=> {
      logger[level](message);
    }
  };
}

// Copied the morgan compile function over so that cooler formats
// may be configured
function compile(fmt) {
  // escape quotes
  fmt = fmt.replace(/"/g, '\\"');
  fmt = fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g,
    function (_, name, arg) {
      return `"\n    + (tokens["${name}"](req, res, "${arg}") || "-") + "`;
    });
  let js = `  return "${fmt}";`;
  // jshint evil:true
  return new Function('tokens, req, res', js);
}

const requestEndLoggingFormat = () => {
  morgan.token('status', (req, res) => {
    let status = res.statusCode;
    let statusStr = status.toString();
    return statusStr;
  });

  morgan.token('res-json', (req, res) => {
    return (trimJSONStr(res, [], 1000) || '');
  });

  return compile(`${('<-- :method :url :status')} ${(':response-time ms - :res[content-length]')} :res-json`);
};

/**
 * Exclude specified properties from the given json
 * and return truncated string representation of input
 * @param json
 * @param exclude list of property names to omit
 * @param maxLen maximum length to allow
 */
const trimJSONStr = function (input, exclude, maxLen) {
  let ret = '';
  let json = _.omit(input, exclude);

  try {
    if (json !== null) {
      ret = JSON.stringify(json).substring(0, maxLen);
    }
  } catch (ign) {

  }
  return ret;
};

function getEndLogFormatter(args) {
  let grey_logger = getLogger('HTTP', args);
  return morgan(requestEndLoggingFormat(), { stream: generateStream(grey_logger, "info") });
}

function getStartLogFormatter(args) {
  let grey_logger = getLogger('HTTP', args);
  return morgan(requestStartLoggingFormat(), { immediate: true, stream: generateStream(grey_logger, "info") });
}

/**
 * Log format for HTTP Request
 */
const requestStartLoggingFormat = () => {
  morgan.token('req-body', (req, res) => {
    return (trimJSONStr(req.body, [], 1000));
  });
  return compile(`--> :method :url :remote-addr :req-body`);
};

export { getEndLogFormatter, getStartLogFormatter };


export let logger = null;

export function InstantiateLogger(args) {
  let httpArgs = {
    isHTTP: args.isHTTP,
    host: args.lhost,
    port: args.lport,
    path: args.lpath,
  };

  logger = getLogger(args.llabel, httpArgs);
}
