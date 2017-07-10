"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// @TODO:: CHOOSE A PROPER DB AND IMPLEMENT SERVICE

/**
 * <p>DBService를 생성해 이 instance를 리턴한다.<br/>
 * args 객체에 isLocal property 값이 true이면 LocalStorage를 이용한 서비스가 생성되며<br/>
 * 그렇지 않으면 Couchbase를 이용한 서비스가 생성된다.</p>
 * 
 * @param  {any} args DB Service 타입을 결정하기 위한 argument(LocalStorage/Couchbase)<br/>isLocal property 필요
 * @returns {Promise<DBService>} 생성된 DBService instance
 * 
 */
var DBServiceBuilder = exports.DBServiceBuilder = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(args) {
    var db;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            db = null;


            if (args.isLocal) {
              db = new LocalStorageService();
            } else {
              db = new CouchbaseService();
            }

            _context.next = 4;
            return db.init(args);

          case 4:
            return _context.abrupt("return", db);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function DBServiceBuilder(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=db-service-builder.js.map
