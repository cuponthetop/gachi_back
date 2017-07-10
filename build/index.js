'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = undefined;

var main = exports.main = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(arg) {
    var args, db, model, handler, app, server;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args = null;


            if (arg) {
              args = arg;
            } else {
              args = _argparse.parser.parseArgs();
            }

            (0, _logger.InstantiateLogger)(args);

            _logger.logger.info('Starting Beagle with args: ' + JSON.stringify(args));

            _context.next = 6;
            return (0, _dbServiceBuilder.DBServiceBuilder)(args);

          case 6:
            db = _context.sent;

            _.assign(args, { dataService: db });

            _context.next = 10;
            return (0, _modelBuilder.modelServiceBuilder)(args);

          case 10:
            model = _context.sent;

            _.assign(args, model);

            _context.next = 14;
            return (0, _controllerBuilder.handlerServiceBuilder)(args);

          case 14:
            handler = _context.sent;

            _.assign(args, handler);

            _context.next = 18;
            return (0, _createServer.createServer)(args, (0, _all.routingFunc)(args));

          case 18:
            app = _context.sent;
            server = app.listen(args.port, function () {
              _logger.logger.info('Gachi listening on port: ' + args.port);
            });


            _.assign(server, { dataService: db });
            _.assign(server, model);
            _.assign(server, handler);

            return _context.abrupt('return', server);

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function main(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _createServer = require('./server/create-server');

var _dbServiceBuilder = require('./server/db-service-builder');

var _modelBuilder = require('./server/model-builder');

var _controllerBuilder = require('./server/controller-builder');

var _all = require('./routes/all');

var _argparse = require('./util/argparse');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _logger = require('./util/logger');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (require.main === module) {
  main(null);
}
//# sourceMappingURL=index.js.map
