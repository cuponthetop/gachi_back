import { ConsoleTransportInstance, HttpTransportInstance, transports } from 'winston';
import * as _ from 'lodash';

/**
 * 'debug' 레벨 이상의 로그를 Http를 통해 로그 서버로 전송하기 위한 transport
 * 
 * @param  {string} moduleName 로그를 남기는 모듈 이름
 * @param  {any} httpOpts 로그 서버의 host, port, uri가 정의된 객체
 * @returns {HttpTransportInstance} 로그 서버 설정이 적용된 winston transport instance
 */
export function getHTTPTransport(moduleName, httpOpts) {
  let host = httpOpts.host;
  let port = httpOpts.port;
  let path = httpOpts.path;

  let transport = new (transports.Http)({
    level: 'debug',
    host,
    port,
    path
  });

  _.set(transport, 'label', moduleName);
  _.set(transport, 'log', function (level, msg, meta, callback) {
    var self = this;

    if (typeof meta === 'function') {
      callback = meta;
      meta = {};
    }

    var options = {
      level: level,
      timestamp: new Date().toISOString(),
      message: msg,
      meta: meta,
      label: this.label
    };


    this._request(options, function (err, res) {
      if (res && res.statusCode !== 200) {
        err = new Error('HTTP Status Code: ' + res.statusCode);
      }

      if (err) return callback(err);

      // TODO: emit 'logged' correctly,
      // keep track of pending logs.
      self.emit('logged');

      if (callback) callback(null, true);
    });
  }.bind(transport));
    
  return transport;
}

/**
 * 'debug' 레벨 이상의 로그를 콘솔에 출력하기 위한 transport
 * 
 * @param  {string} moduleName 로그를 남기는 모듈 이름
 * @returns {ConsoleTransportInstance} 콘솔 설정이 적용된 winston transport instance
 */
export function getConsoleTransport(moduleName) {
  let transport = new (transports.Console)({
    level: 'debug',
    colorize: true,
    timestamp: true,
    label: moduleName,
  });

  return transport;
}

