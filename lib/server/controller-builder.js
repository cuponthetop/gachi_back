import * as _ from 'lodash';

import { AuthController } from '../controller/auth';
import { LeadroomController } from '../controller/leadroom';
import { RequestController } from '../controller/request';
import { UserController } from '../controller/user';
import { FestivalController } from '../controller/festival';

export async function handlerServiceBuilder(args) {

  let ret = {};

  let firebaseService = _.get(args, 'firebaseService', null);
  let userManager = _.get(args, 'userManager', null);
  let festivalManager = _.get(args, 'festivalManager', null);
  let genreManager = _.get(args, 'genreManager', null);
  let leadroomManager = _.get(args, 'leadroomManager', null);
  let userGenreManager = _.get(args, 'userGenreManager', null);
  let festivalGenreManager = _.get(args, 'festivalGenreManager', null);
  let leadroomMemberManager = _.get(args, 'leadroomMemberManager', null);
  let requestManager = _.get(args, 'requestManager', null);


  _.assign(ret, { authCtrl: new AuthController(firebaseService) });
  _.assign(ret, { requestCtrl: new RequestController(userManager, festivalManager, leadroomManager, requestManager, firebaseService) });
  _.assign(ret, { leadroomCtrl: new LeadroomController(userManager, festivalManager, leadroomManager, firebaseService) });
  _.assign(ret, { userCtrl: new UserController(userManager, userGenreManager) });
  _.assign(ret, { festivalCtrl: new FestivalController(festivalManager, festivalGenreManager) });

  return ret;
}