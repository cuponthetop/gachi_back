'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserManager = exports.User = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = exports.User = function User(id, name) {
  _classCallCheck(this, User);
};

;

var UserManager = exports.UserManager = function () {
  function UserManager(dataService) {
    _classCallCheck(this, UserManager);
  }

  _createClass(UserManager, [{
    key: 'get',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(userID) {
        var userInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.dataService.find('users', {
                  id: userID
                });

              case 3:
                userInfo = _context.sent;
                return _context.abrupt('return', projInfo);

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);
                return _context.abrupt('return', null);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'save',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(datum) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function save(_x2) {
        return _ref2.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'delete',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(datum) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _delete(_x3) {
        return _ref3.apply(this, arguments);
      }

      return _delete;
    }()
  }]);

  return UserManager;
}();
//# sourceMappingURL=user.js.map
