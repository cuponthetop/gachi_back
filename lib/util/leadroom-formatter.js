import * as _ from 'lodash';
import { sequelizeAsyncmap } from './common-formatter';

const USER_PICK = [
  'uid', 'reliability', 'profile_image', 'nickname'
];
const FESTIVAL_PICK = [
  'fid', 'detail', 'image', 'location', 'title', 'from', 'until', 'starring'
];

const HIDE_ATTRS = [
  'leader_id', 'fid', 'updatedAt'
];

export async function includeMember(leadroom, jsoned) {
  let members = await leadroom.getMember();
  _.set(jsoned, 'member', _.map(members, function (member) { return _.pick(member.toJSON(), USER_PICK); }));
  _.set(jsoned, 'numMembers', jsoned.member.length);

  return jsoned;
}

export async function includeFestival(leadroom, jsoned) {
  let festival = await leadroom.getFestival();
  _.set(jsoned, 'festival', _.pick(festival.toJSON(), FESTIVAL_PICK));

  return jsoned;
}

export async function includeLeader(leadroom, jsoned) {
  let leader = await leadroom.getLeader();
  _.set(jsoned, 'leader', _.pick(leader.toJSON(), USER_PICK));

  return jsoned;
}

export async function includeAllForLeadroom(leadroom, jsoned) {
  let ret = await includeMember(leadroom, jsoned);
  ret = await includeFestival(leadroom, ret);
  ret = await includeLeader(leadroom, ret);

  ret = _.omit(ret, HIDE_ATTRS);

  return ret;
}

export let includeMembersToResults = sequelizeAsyncmap.bind(null, includeMember);

export let includeAllForLeadroomToResults = sequelizeAsyncmap.bind(null, includeAllForLeadroom);