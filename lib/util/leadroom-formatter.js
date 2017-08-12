import * as _ from 'lodash';
import { sequelizeAsyncmap } from './common-formatter';

async function includeMember(leadroom, jsoned) {
  let members = await leadroom.getMembers();
  _.set(jsoned, 'members', _.map(members, function (member) { return { member: members.member }; }));
  return jsoned;
}

export let includeMembersToResults = sequelizeAsyncmap.bind(null, includeMember);