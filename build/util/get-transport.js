'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHTTPTransport = getHTTPTransport;
exports.getConsoleTransport = getConsoleTransport;

var _winston = require('winston');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * 'debug' 레벨 이상의 로그를 Http를 통해 로그 서버로 전송하기 위한 transport
 * 
 * @param  {string} moduleName 로그를 남기는 모듈 이름
 * @param  {any} httpOpts 로그 서버의 host, port, uri가 정의된 객체
 * @returns {HttpTransportInstance} 로그 서버 설정이 적용된 winston transport instance
 */
function getHTTPTransport(moduleName, httpOpts) {
  var host = httpOpts.host;
  var port = httpOpts.port;
  var path = httpOpts.path;

  var transport = new _winston.transports.Http({
    level: 'debug',
    host: host,
    port: port,
    path: path
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
function getConsoleTransport(moduleName) {
  var transport = new _winston.transports.Console({
    level: 'debug',
    colorize: true,
    timestamp: true,
    label: moduleName
  });

  return transport;
}
//# sourceMappingURL=get-transport.js.map
