import * as _ from 'lodash';
import { sequelizeAsyncmap } from './common-formatter';

async function includeMember(leadroom, jsoned) {
  let members = await leadroom.getMember();
  _.set(jsoned, 'members', _.map(members, function (member) { return member.toJSON().uid; }));
  _.set(jsoned, 'numMembers', jsoned.members.length);

  return jsoned;
}

export let includeMembersToResults = sequelizeAsyncmap.bind(null, includeMember);