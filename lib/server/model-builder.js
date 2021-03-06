import * as _ from 'lodash';

import { GoogleCloudStorageManager } from '../model/gc-storage';
import { GenreManager } from '../model/genre';
import { UserManager } from '../model/user';
import { FestivalManager } from '../model/festival';
import { FestivalGenreManager } from '../model/festival-genre';
import { UserGenreManager } from '../model/user-genre';
import { LeadroomManager } from '../model/leadroom';
import { LeadroomMemberManager } from '../model/leadroom-member';
import { RequestManager } from '../model/request';

export async function modelServiceBuilder(args) {

  let ret = {};

  let dataService = args.dataService;

  _.assign(ret, { storageManager: new GoogleCloudStorageManager() });
  _.assign(ret, { userManager: new UserManager(dataService) });
  _.assign(ret, { festivalManager: new FestivalManager(dataService) });
  _.assign(ret, { genreManager: new GenreManager(dataService) });
  _.assign(ret, { leadroomManager: new LeadroomManager(dataService) });
  _.assign(ret, { userGenreManager: new UserGenreManager(dataService) });
  _.assign(ret, { festivalGenreManager: new FestivalGenreManager(dataService) });
  _.assign(ret, { leadroomMemberManager: new LeadroomMemberManager(dataService) });
  _.assign(ret, { requestManager: new RequestManager(dataService) });

  let res = await args.dataService.showAllSchemas();
  let res2 = await args.dataService.sync({
    force: args.dbreset
  });

  if (args.dbreset) {
    let genres = require('../../db-scripts/genres.json');
    // populate genres
    await ret.genreManager.model.bulkCreate(genres);
  }

  return ret;
}