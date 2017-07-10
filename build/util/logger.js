'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStartLogFormatter = exports.getEndLogFormatter = undefined;
exports.getLogger = getLogger;

var _chalk = require('chalk');

var chalk = _interopRequireWildcard(_chalk);

var _morgan = require('morgan');

var morgan = _interopRequireWildcard(_morgan);

var _winston = require('winston');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _types = require('./types');

var _getTransport = require('./get-transport');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * <p>모듈(moduleName)에 대한 LoggerInstance를 리턴하며,<br/>
 * 해당 모듈에 대한 LoggerInstance가 존재하지 않다면 새로 생성하여 이를 리턴한다.</p>
 *
 * @param  {string} moduleName 모듈 이름
 * @param  {any} httpOpts 로그 서버의 host, port, uri가 정의된 객체
 * @returns {LoggerInstance} 모듈에 대한 LoggerInstance
 */
function getLogger(moduleName, httpOpts) {
  var logger = null;

  if (false === _winston.loggers.has(moduleName)) {
    var _transports = [];
    var console = (0, _getTransport.getConsoleTransport)(moduleName);
    _transports.push(console);
    if (true === _.get(httpOpts, 'isHTTP', false)) {
      var http = (0, _getTransport.getHTTPTransport)(moduleName, httpOpts);
      _transports.push(http);
    }

    logger = _winston.loggers.add(moduleName, {
      transports: _transports
    });
  } else {
    logger = _winston.loggers.get(moduleName);
  }

  return logger;
}

/**
 * Generate stream object which can be used by morgan to print out it's logs
 */
function generateStream(logger, level) {
  return {
    write: function write(message) {
      logger[level](message);
    }
  };
}

// Copied the morgan compile function over so that cooler formats
// may be configured
function compile(fmt) {
  // escape quotes
  fmt = fmt.replace(/"/g, '\\"');
  fmt = fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function (_, name, arg) {
    return '"\n    + (tokens["' + name + '"](req, res, "' + arg + '") || "-") + "';
  });
  var js = '  return "' + fmt + '";';
  // jshint evil:true
  return new Function('tokens, req, res', js);
}

var requestEndLoggingFormat = function requestEndLoggingFormat() {
  morgan.token('status', function (req, res) {
    var status = res.statusCode;
    var statusStr = status.toString();
    if (status >= 500) {
      statusStr = chalk.red(statusStr);
    } else if (status >= 400) {
      statusStr = chalk.yellow(statusStr);
    } else if (status >= 300) {
      statusStr = chalk.cyan(statusStr);
    } else {
      statusStr = chalk.green(statusStr);
    }
    return statusStr;
  });

  morgan.token('res-json', function (req, res) {
    return chalk.grey(trimJSONStr(res, [], 1000) || '');
  });

  return compile(chalk.white('<-- :method :url :status') + ' ' + chalk.grey(':response-time ms - :res[content-length]') + ' :res-json');
};

/**
 * Exclude specified properties from the given json
 * and return truncated string representation of input
 * @param json
 * @param exclude list of property names to omit
 * @param maxLen maximum length to allow
 */
var trimJSONStr = function trimJSONStr(input, exclude, maxLen) {
  var ret = '';
  var json = _.omit(input, exclude);

  try {
    if (json !== null) {
      ret = JSON.stringify(json).substring(0, maxLen);
    }
  } catch (ign) {}
  return ret;
};

function getEndLogFormatter(args) {
  var grey_logger = getLogger('HTTP', args);
  return morgan(requestEndLoggingFormat(), { stream: generateStream(grey_logger, "info") });
}

function getStartLogFormatter(args) {
  var grey_logger = getLogger('HTTP', args);
  return morgan(requestStartLoggingFormat(), { immediate: true, stream: generateStream(grey_logger, "info") });
}

/**
 * Log format for HTTP Request
 */
var requestStartLoggingFormat = function requestStartLoggingFormat() {
  morgan.token('req-body', function (req, res) {
    return chalk.grey(trimJSONStr(req.body, [], 1000));
  });
  return compile(chalk.white('-->') + ' ' + chalk.white(':method') + ' ' + chalk.white(':url') + ' ' + chalk.white(':remote-addr') + ' :req-body');
};

exports.getEndLogFormatter = getEndLogFormatter;
exports.getStartLogFormatter = getStartLogFormatter;
//# sourceMappingURL=logger.js.map
