'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skeletalGet = undefined;

/**
 * <p>
 * 기존 Oject에서 원하는 property만으로 구성된 Object 생성한다.<br/>
 * Property 목록은 두 arguments를 통해 구성/제한할 수 있다. (fields, fieldsToOmit)<br/>
 * 참고. 기본적으로 _(lodash).pick()과 같은 기능이지만,<br/>
 * fieldsToOmit을 통해 안전하지 않은 property를 제공하는 것에 제한을 둠
 * </p>
 * 
 * <p>
 * 참고<br/>
 * omit(object, [paths]) : object에서 paths에 해당하는 properties 제외<br/>
 * pullAll(array, [values]): array에서 values 값 제외하고 추출<br/>
 * pick(object, [fields]): object의 key가 fields에 해당하는 property만 추출
 * </p>
 * 
 * @param {LoggerInstance} logger Logger Instance
 * @param {string[]} fields modelInfo object에서 추출하고 싶은 property name Array
 * @param {string[]} fieldsToOmit 추출을 제한하는 property name Array
 * @param {*} modelInfo 원본 Object
 * @returns {Promise<any>} 제한된 property를 제외하고 원본 object에서 원하는 property만으로 구성된 object
 * @throws {Error} modelInfo에서 fieldsToOmit에 해당하는 property를 제외하고 fields에 해당하는 propery가 없을 때 발생
 */
var skeletalGet = exports.skeletalGet = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(logger, fields, fieldsToOmit, modelInfo) {
    var returnInfo, ret, invalidFields;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            returnInfo = _.omit(modelInfo, fieldsToOmit);
            ret = void 0;

            if (!(_.isUndefined(fields) === false)) {
              _context.next = 10;
              break;
            }

            if (_.isArray(fields) === false) {
              fields = _.concat([], fields);
            }

            invalidFields = _.pullAll(_.clone(fields), _.keys(returnInfo));

            if (!(invalidFields.length !== 0)) {
              _context.next = 7;
              break;
            }

            throw new Error('Field Selector should be provided with array of strings');

          case 7:

            ret = _.pick(returnInfo, fields);
            _context.next = 11;
            break;

          case 10:
            ret = returnInfo;

          case 11:
            return _context.abrupt('return', ret);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function skeletalGet(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=controller-skeleton.js.map
