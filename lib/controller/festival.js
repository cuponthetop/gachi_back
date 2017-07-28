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

  async loadTargetFestivalInfo(req, res, next) {
    let festivalID = req.params["fid"];

    let festivalInfo = await this.festivalMgr.model.findById(festivalID);

    if (_.isNull(festivalInfo)) {
      logger.info(`loadTargetFestival - festivalID: ${festivalID} not found`);
      failWith(logger, res, 'Target Festival Not Found', 404);
    } else {
      _.set(req, 'info.targetFestival', festivalInfo);

      next();
    }
  }

  async getFestivalList(req, res) {
  }

  async createFestival(req, res) {

  }

  async searchFestival(req, res) {

  }

  async getFestival(req, res) {
  }

};