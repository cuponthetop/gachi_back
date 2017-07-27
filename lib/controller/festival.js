import { Festival as FestivalModel, FestivalManager } from '../model/festival';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';

export class FestivalController {

  constructor(
    festivalMgr,
    festivalGenreMgr
  ) {
    this.festivalMgr = festivalMgr;
    this.festivalGenreMgr = festivalGenreMgr;
  }

  async loadRequestedUserInfo(req, res, next) {
  }

  async getUser(req, res) {
  }

};