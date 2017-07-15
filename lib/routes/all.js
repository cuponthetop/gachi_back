import express from 'express';

import { routingFunc as user } from './v1/user';
import { routingFunc as request } from './v1/match';
import { routingFunc as festival } from './v1/festival';
import { routingFunc as leader } from './v1/leader';
// import { AccessController } from '../controller/access';

export function routingFunc(args) {

  let routes = express();

  // let accessCtrl = args.accessCtrl;

  // routes.use('/v1', accessCtrl.doAuth.bind(accessCtrl));

  // every route requires auth
  routes.use('/v1/user', user(args));

  routes.use('/v1/leader', leader(args));
  
  routes.use('/v1/request', request(args));

  routes.use('/v1/festival', festival(args));

  return routes;
}
