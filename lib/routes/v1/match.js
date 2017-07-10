import express from 'express';

import { MatchController } from '../../controller/match';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let match = express();

  let matchCtrl = args.matchCtrl;

  return match;
}