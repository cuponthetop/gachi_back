import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class RequestController {

  constructor(
    userMgr,
    festivalMgr,
    matchMgr
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.matchMgr = matchMgr;
  }

  async loadRequestedRequestInfo(req, res, next) {
  }

};