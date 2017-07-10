import * as express from 'express';

import { FestivalController } from '../../controller/festival';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let festival = express();

  let festivalCtrl = args.festivalCtrl;

  return festival;
}