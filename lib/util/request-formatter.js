import * as _ from 'lodash';
import { sequelizeAsyncmap } from './common-formatter';

export async function includeLeadroom(request, jsoned) {
  const attributesToPick = ['leadroom_id', 'max_follower', 'lead_from', 'lead_until', 'festival', 'leader'];
  const attributesToPickForLeader = ['uid', 'profile_image', 'nickname', 'age', 'gender', 'reliability', 'location'];
  const attributesToPickForFestival = ['fid', 'image', 'from', 'until', 'title'];

  let leadroom = await request.getLeadroom();
  let leader = await leadroom.getLeader();
  let festival = await leadroom.getFestival();

  let leadroomJson = leadroom.toJSON();
  _.set(leadroomJson, 'leader', _.pick(leader.toJSON(), attributesToPickForLeader));
  _.set(leadroomJson, 'festival', _.pick(festival.toJSON(), attributesToPickForFestival));

  _.set(jsoned, 'leadroom', _.pick(leadroomJson, attributesToPick));

  return jsoned;
}

export async function includeRequester(request, jsoned) {
  const attributesToPick = ['uid', 'profile_image', 'nickname', 'age', 'gender', 'reliability', 'location'];
  let requester = await request.getRequester();
  _.set(jsoned, 'requester', _.pick(requester.toJSON(), attributesToPick));

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