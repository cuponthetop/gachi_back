import express from 'express';

import { FestivalController } from '../../controller/festival';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let festival = express();

  let festivalCtrl = args.festivalCtrl;
  
  festival.get('s/',
     festivalCtrl.getFestivalList.bind(festivalCtrl)
   );

  festival.get('/:festid',
     festivalCtrl.loadRequestedFestival.bind(festivalCtrl),
     festivalCtrl.getFestival.bind(festivalCtrl)
   );
  
  festival.post('/',
     festivalCtrl.createFestival.bind(festivalCtrl)
   );


  return festival;
}