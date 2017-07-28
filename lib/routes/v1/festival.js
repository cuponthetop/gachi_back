import express from 'express';

import { FestivalController } from '../../controller/festival';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let festival = express();

  let festivalCtrl = args.festivalCtrl;
  let authCtrl = args.authCtrl;

  festival.get('s/',
    festivalCtrl.getFestivalList.bind(festivalCtrl)
  );

  festival.get('/search',
    festivalCtrl.searchFestival.bind(festivalCtrl)
  );

  festival.get('/:fid',
    festivalCtrl.loadTargetFestivalInfo.bind(festivalCtrl),
    festivalCtrl.getFestival.bind(festivalCtrl)
  );

  festival.post('/',
    authCtrl.authenticate.bind(authCtrl),
    festivalCtrl.createFestival.bind(festivalCtrl)
  );

  return festival;
}