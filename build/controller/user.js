'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../model/user');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _response = require('../util/response');

var _crypto = require('crypto');

var _logger = require('../util/logger');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameController = exports.GameController = function () {
  function GameController(userMgr) {
    _classCallCheck(this, GameController);
  }

  _createClass(GameController, [{
    key: 'loadRequestedUserInfo',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
        var userid, userInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                userid = req.params["uid"];
                _context.next = 3;
                return this.userMgr.get(userid);

              case 3:
                userInfo = _context.sent;


                if (_.isNull(userInfo)) {
                  _logger.logger.info('loadRequestedUser - userid: ' + userid + ' not found');
                  (0, _response.failWith)(res, 'Requested User Not Found', 404);
                } else {
                  _.set(req, 'info.requestedUser', userInfo);

                  next();
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadRequestedUserInfo(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return loadRequestedUserInfo;
    }()
  }, {
    key: 'getUser',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
        var userInfo, fields, fieldsToOmit, ret;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userInfo = req.info.requestedUser;
                fields = req.query.fields;
                fieldsToOmit = [];
                _context2.prev = 3;
                _context2.next = 6;
                return skeletalGet(_logger.logger, fields, fieldsToOmit, userInfo);

              case 6:
                ret = _context2.sent;


                (0, _response.succeedWith)(res, ret, 200);
                _context2.next = 13;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2['catch'](3);

                if (_context2.t0.message === 'Field Selector should be provided with array of strings') {
                  (0, _response.succeedWith)(res, {}, 200);
                } else {
                  (0, _response.failWith)(res, _context2.t0.message, 500);
                }

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 10]]);
      }));

      function getUser(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return getUser;
    }()
  }]);

  return GameController;
}();

;
//# sourceMappingURL=user.js.map
