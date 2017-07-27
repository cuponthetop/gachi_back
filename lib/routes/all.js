import express from 'express';

import { routingFunc as user } from './v1/user';
import { routingFunc as request } from './v1/request';
import { routingFunc as festival } from './v1/festival';
import { routingFunc as leadroom } from './v1/leadroom';

export function routingFunc(args) {

  let routes = express();

  // every route requires auth
  routes.use('/v1/user', user(args));

  routes.use('/v1/leadroom', leadroom(args));

  routes.use('/v1/request', request(args));

  routes.use('/v1/festival', festival(args));

  return routes;
}
