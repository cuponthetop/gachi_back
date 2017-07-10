import { Match as MatchModel, MatchManager } from '../model/match';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class MatchController {

  constructor(
    matchMgr
  ) { }

  async loadRequestedUserInfo(req, res, next) {
  }

  async getUser(req, res) {
  }

};