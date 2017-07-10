'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlerServiceBuilder = undefined;

var handlerServiceBuilder = exports.handlerServiceBuilder = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(args) {
    var ret, userManager, festivalManager, matchManager;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ret = {};
            userManager = _.get(args, 'userManager', null);
            festivalManager = _.get(args, 'festivalManager', null);
            matchManager = _.get(args, 'matchManager', null);


            _.assign(ret, { matchCtrl: new _match.MatchController(userManager, festivalManager) });
            _.assign(ret, { userCtrl: new _user.UserController(userManager) });
            _.assign(ret, { festivalCtrl: new _festival.FestivalController(festivalManager) });

            return _context.abrupt('return', ret);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function handlerServiceBuilder(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _match = require('../controller/match');

var _user = require('../controller/user');

var _festival = require('../controller/festival');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=controller-builder.js.map
