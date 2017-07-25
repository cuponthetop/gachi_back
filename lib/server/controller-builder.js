import * as _ from 'lodash';

import { AuthController } from '../controller/auth';
import { LeaderController } from '../controller/leader';
import { RequestController } from '../controller/request';
import { UserController } from '../controller/user';
import { FestivalController } from '../controller/festival';

export async function handlerServiceBuilder(args) {

  let ret = {};
  
  let firebaseService = _.get(args, 'firebaseService', null);
  let userManager = _.get(args, 'userManager', null);
  let festivalManager = _.get(args, 'festivalManager', null);
  let matchManager = _.get(args, 'matchManager', null);

  _.assign(ret, { authCtrl: new AuthController(firebaseService) });
  _.assign(ret, { requestCtrl: new RequestController(userManager, festivalManager, matchManager) });
  _.assign(ret, { leaderCtrl: new LeaderController(userManager, festivalManager, matchManager) });
  _.assign(ret, { userCtrl: new UserController(userManager) });
  _.assign(ret, { festivalCtrl: new FestivalController(festivalManager) });

  return ret;
}