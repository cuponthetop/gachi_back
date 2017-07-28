import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class LeadroomController {

  constructor(
    userMgr,
    festivalMgr,
    leadroomMgr,
    leadroomMemberMgr,
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.leadroomMgr = leadroomMgr;
    this.leadroomMemberMgr = leadroomMemberMgr;
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
  }

  async removeLeadroom(req, res) {
  }

  async updateLeadroom(req, res) {
  }

  async exitLeadroom(req, res) {
  }
};