'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelServiceBuilder = undefined;

var modelServiceBuilder = exports.modelServiceBuilder = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(args) {
    var ret, dataService;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ret = {};
            dataService = args.dataService;


            _.assign(ret, { userManager: new _user.UserManager(dataService) });
            _.assign(ret, { festivalManager: new _festival.FestivalManager(dataService) });
            _.assign(ret, { matchManager: new _match.MatchManager(dataService) });

            return _context.abrupt('return', ret);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function modelServiceBuilder(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _match = require('../model/match');

var _user = require('../model/user');

var _festival = require('../model/festival');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=model-builder.js.map
