import { Match as MatchModel, MatchManager } from '../model/match';
import { User as UserModel, UserManager } from '../model/user';
import { Festival as FestivalModel, FestivalManager } from '../model/festival';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class LeaderController {

  constructor(
    userMgr,
    festivalMgr,
    matchMgr
  ) { }

  async loadRequestedLeaderInfo(req, res, next) {
  }

  async getLeader(req, res) {
  }

};