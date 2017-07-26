import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class LeaderController {

  constructor(
    userMgr,
    festivalMgr,
    matchMgr
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.matchMgr = matchMgr;
  }

  async loadRequestedLeaderInfo(req, res, next) {
  }

  async getLeaderList(req, res) {
  }

};