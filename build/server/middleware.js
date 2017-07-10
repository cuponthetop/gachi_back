'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectMiddleware = injectMiddleware;

var _bodyParser = require('body-parser');

var bodyParser = _interopRequireWildcard(_bodyParser);

var _methodOverride = require('method-override');

var methodOverride = _interopRequireWildcard(_methodOverride);

var _logger = require('../util/logger');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Cross Origin Resource Sharing(CORS)를 위한 설정
 * 
 */
function getAllowCrossDomain(logArgs) {
  var logger = (0, _logger.getLogger)('CORS', logArgs);

  return function (req, res, next) {
    try {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE,PATCH');
      res.header('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization, content-disposition');

      // need to respond 200 to OPTIONS
      if ('OPTIONS' === req.method) {
        res.sendStatus(200);
      } else {
        next();
      }
    } catch (err) {
      logger.error('Unexpected error: ' + err.stack);
      next();
    }
  };
}

/**
 * 패킷 로깅(HTTP req/res) / 크로스 오리진 액세스, 바디파서, 메서드오버라이드 등의 미들웨어 추가
 * 
 * @param  {Application} app 미들웨어가 추가될 Application
 * @param  {any} env 
 */
function injectMiddleware(app, args) {

  var httpArgs = {
    host: args.lhost, port: args.lport,
    path: args.lpath
  };

  // 패킷 로깅
  app.use((0, _logger.getEndLogFormatter)(httpArgs));

  // 크로스 오리진 액세스
  app.use(getAllowCrossDomain(httpArgs));

  // 바디파서, 메서드오버라이드
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // 패킷 로깅
  app.use((0, _logger.getStartLogFormatter)(httpArgs));
}
//# sourceMappingURL=middleware.js.map
