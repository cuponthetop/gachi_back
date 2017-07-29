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
    let targetFID = _.get(req.body, 'fid', null);
    let uid = _.get(req.info, 'requestingUserID', null);
    let fbid = _.get(req.info, 'requestingFBUserID', null);

    let max_follower = _.get(req.body, 'max_follower', 4);
    let lead_from = _.get(req.body, 'from', null);
    let lead_until = _.get(req.body, 'until', null);
    let age = _.get(req.body, 'age', '');
    let characteristic = _.get(req.body, 'charactersitic', '');
    let location = _.get(req.body, 'location', '');
    let detail = _.get(req.body, 'detail', '');

    let newLeadroom = null;
    try {
      newLeadroom = await this.leadroomMgr.model.create({
        fid: targetFID,
        leader_id: uid,
        max_follower,
        lead_from,
        lead_until,
        age,
        characteristic,
        location,
        detail
      });
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    // create chatroom/member
    try {
      succeedWith(logger, res, { leadroom_id: newLeadroom.leadroom_id }, 200);
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

  async validateCreate(req, res, next) {
    let targetFID = _.get(req.body, 'fid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    let max_follower = _.get(req.body, 'max_follower', 4);
    let lead_from = _.get(req.body, 'from', null);
    let lead_until = _.get(req.body, 'until', null);
    let age = _.get(req.body, 'age', '');
    let characteristic = _.get(req.body, 'charactersitic', '');
    let location = _.get(req.body, 'location', '');
    let detail = _.get(req.body, 'detail', '');

    if (_.isNull(lead_from) || _.isNull(lead_until)) {
      return failWith(logger, res, `body.from and body.until is required to create a Leadroom`, 400);
    }

    try {
      // check if same fid,uid comb is already created
      let result = await this.leadroomMgr.model.findAll({
        where: {
          fid: targetFID,
          leader_id: uid
        }
      });

      if (false === _.isEmpty(result.length)) {
        return failWith(logger, res, `You already have leadroom in ${targetFID}, ${uid}`, 400);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }
};