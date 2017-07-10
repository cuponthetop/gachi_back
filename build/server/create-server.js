'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServer = undefined;

/**
 * <p>
 * 모듈의 비즈니스 로직을 담당하는 express server instance를 생성한다. <br/>
 * Grey-wolf에서는 기본적인 middleware만 추가한 server를 생성한다.<br/>
 * middleware: logger, body-parser, method-override, cross origin access
 * </p>
 * 
 * @param  {*} args Server 구성에 필요한 arguments
 * @param  {express.Router} routes api router
 * @returns {Promise<express.Application>} middleware가 추가된 기본적인 server instance
 */
var createServer = exports.createServer = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(args, routes) {
    var app;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = express();


            (0, _middleware.injectMiddleware)(app, args);

            app.use('/api', routes);

            app.use(function (req, res) {
              res.status(404).send();
            });

            return _context.abrupt('return', app);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createServer(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _middleware = require('./middleware');

var _express = require('express');

var express = _interopRequireWildcard(_express);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=create-server.js.map
