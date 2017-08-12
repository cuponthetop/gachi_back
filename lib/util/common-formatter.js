import * as _ from 'lodash';


export async function sequelizeAsyncmap(func, result) {
  let resultsPromises = _.map(result, async function (el) {
    return await func(el, el.toJSON());
  });

  return await Promise.all(resultsPromises);
}

export function filterAndOrderResults(result, order, limit, offset) {
  return _.slice(_.orderBy(result, order.attributes, order.methods), offset, offset + limit + 1);
}