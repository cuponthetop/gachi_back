import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class LeadroomController {

  constructor(
    userMgr,
    festivalMgr,
    leadroomMgr,
    fbApp,
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.leadroomMgr = leadroomMgr;
    this.fbApp = fbApp;
  }

  async loadTargetLeadroomInfo(req, res, next) {
    let lid = req.params["lid"];

    let leadroomInfo = await this.leadroomMgr.model.findById(lid);

    if (_.isNull(leadroomInfo)) {
      logger.info(`loadTargetLeadroom - leadroom_id: ${lid} not found`);
      failWith(logger, res, 'Target Leadroom Not Found', 404);
    } else {
      _.set(req, 'info.targetLeadroom', leadroomInfo);

      next();
    }
  }

  async getLeadroomList(req, res) {
  }

  async getLeadroom(req, res) {
  }

  async createLeadroom(req, res) {

    try {
      succeedWith(logger, res, { fid: newFestival.fid }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async removeLeadroom(req, res) {
  }

  async updateLeadroom(req, res) {
  }

  async exitLeadroom(req, res) {
  }
};