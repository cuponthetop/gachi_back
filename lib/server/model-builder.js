import * as _ from 'lodash';

import { MatchManager } from '../model/match';
import { UserManager } from '../model/user';
import { FestivalManager } from '../model/festival';

export async function modelServiceBuilder(args) {

  let ret = {};

  let dataService = args.dataService;

  _.assign(ret, { userManager: new UserManager(dataService) });
  _.assign(ret, { festivalManager: new FestivalManager(dataService) });
  _.assign(ret, { matchManager: new MatchManager(dataService) });

  let res = await args.dataService.showAllSchemas();
  let res2 = await args.dataService.sync();

  return ret;
}