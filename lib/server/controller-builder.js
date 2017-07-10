import * as _ from 'lodash';

import { MatchController } from '../controller/match';
import { UserController } from '../controller/user';
import { FestivalController } from '../controller/festival';

export async function handlerServiceBuilder(args) {

  let ret = {};
  
  let userManager = _.get(args, 'userManager', null);
  let festivalManager = _.get(args, 'festivalManager', null);
  let matchManager = _.get(args, 'matchManager', null);

  _.assign(ret, { matchCtrl: new MatchController(userManager, festivalManager) });
  _.assign(ret, { userCtrl: new UserController(userManager) });
  _.assign(ret, { festivalCtrl: new FestivalController(festivalManager) });

  return ret;
}