import * as _ from 'lodash';

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
export async function skeletalGet(logger, fields, fieldsToOmit, modelInfo) {

  let returnInfo = _.omit(modelInfo, fieldsToOmit);

  let ret;

  if (_.isUndefined(fields) === false) {
    if (_.isArray(fields) === false) {
      fields = _.concat([], fields);
    }

    let invalidFields = _.pullAll(_.clone(fields), _.keys(returnInfo));

    if (invalidFields.length !== 0) {
      throw new Error('Field Selector should be provided with array of strings');
    }

    ret = _.pick(returnInfo, fields);
  } else {
    ret = returnInfo;
  }

  return ret;
}
