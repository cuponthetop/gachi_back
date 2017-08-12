import * as _ from 'lodash';
import { sequelizeAsyncmap } from './common-formatter';

export async function includeLeadroom(request, jsoned) {
  let leadroom = await request.getLeadroom();
  _.set(jsoned, 'leadroom', leadroom.toJSON());

  return jsoned;
}

export async function includeRequester(request, jsoned) {
  let requester = await request.getRequester();
  _.set(jsoned, 'requester', requester.toJSON());

  return jsoned;
}

export async function includeLeadroomThenRequester(request, jsoned) {
  let ret = await includeLeadroom(request, jsoned);
  ret = await includeRequester(request, ret);
  return ret;
}

export let includeLeadroomToResults = sequelizeAsyncmap.bind(null, includeLeadroom);

export let includeRequesterToResults = sequelizeAsyncmap.bind(null, includeRequester);

export let includeLeadroomAndRequesterToResults = sequelizeAsyncmap.bind(null, includeLeadroomThenRequester);