import * as _ from 'lodash';
import { sequelizeAsyncmap } from './common-formatter';

async function includeMember(leadroom, jsoned) {
  let members = await leadroom.getMember();
  _.set(jsoned, 'members', _.map(members, function (member) { return members.toJSON().uid; }));
  return jsoned;
}

export let includeMembersToResults = sequelizeAsyncmap.bind(null, includeMember);