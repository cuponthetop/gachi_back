import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class RequestController {

  constructor(
    userMgr,
    festivalMgr,
    leadroomMgr,
    requestMgr,
    fbApp
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.leadroomMgr = leadroomMgr;
    this.requestMgr = requestMgr;
    this.fbApp = fbApp;
  }

  async loadTargetRequestInfo(req, res, next) {
    let rid = req.params["rid"];

    let requestInfo = await this.requestMgr.model.findById(rid);

    if (_.isNull(requestInfo)) {
      logger.info(`loadTargetRequestInfo - request: ${rid} not found`);
      failWith(logger, res, 'Target Request Not Found', 404);
    } else {
      _.set(req, 'info.targetRequest', requestInfo);

      next();
    }
  }

  async getSentRequestList(req, res) {
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      let result = await this.requestMgr.model.findAll({
        where: {
          requester_id: uid
        }
      });
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getReceivedRequestList(req, res) {
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      let result = await this.requestMgr.model.findAll({
        where: {
          '$leadroom.leader_id$': uid
        },
        include: [{
          model: this.leadroomMgr.model,
          as: 'leadroom'
        }]
      });
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async createRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      newRequest = await this.requestMgr.model.create({
        leadroom_id: lid,
        requester_id: uid,
        status: 'pending'
      });

      succeedWith(logger, res, { lid, uid }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async cancelRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);
    let request = _.get(req.info, 'targetRequest', null);

    if (request.getDataValue('status') !== "pending") {
      return failWith(logger, res, 'request is not pending status', 400);
    }

    try {
      let updateRes = await request.update({ status: 'canceled' });
      succeedWith(logger, res, updateRes, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async refuseRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let leader_id = _.get(req.info, 'requestingUserID', null);
    let request = _.get(req.info, 'targetRequest', null);

    if (request.getDataValue('status') !== "pending") {
      return failWith(logger, res, 'request is not pending status', 400);
    }
    // check leader_id and lid
    try {
      let result = await this.leadroomMgr.findAll({
        where: {
          leadroom_id: lid,
          leader_id: uid
        }
      });

      if (false === _.isEmpty(result.length)) {
        return failWith(logger, res, `Not existing ${lid}, ${uid}`, 400);
      }

    }catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      let updateRes = await request.update({ status: 'rejected' });
      succeedWith(logger, res, updateRes, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async acceptRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let leader_id = _.get(req.info, 'requestingUserID', null);
    let request = _.get(req.info, 'targetRequest', null);

    if (request.getDataValue('status') !== "pending") {
      return failWith(logger, res, 'request is not pending status', 400);
    }
    // leader_id and lid
    try {
      let result = await this.leadroomMgr.findAll({
        where: {
          leadroom_id: lid,
          leader_id: uid
        }
      });

      if (false === _.isEmpty(result.length)) {
        return failWith(logger, res, `Not existing ${lid}, ${uid}`, 400);
      }

    }catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      let updateRes = await request.update({ status: 'accepted' });
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      // TODO:: add requester to chatroom member
      succeedWith(logger, res, updateRes, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async validateExistingLeadroom(req, res, next) {
    let lid = _.get(req.body, 'lid', null);

    if (_.isNull(lid)) {
      return failWith(logger, res, `body.lid is required to send a request to a Leadroom`, 400);
    }

    try {
      // check if same given lid is refering to existing leadroom
      let result = await this.leadroomMgr.findAll({
        where: {
          leadroom_id: lid
        }
      });

      if (false === _.isEmpty(result.length)) {
        return failWith(logger, res, `Not existing ${lid}`, 400);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async validateExistingPendingRequest(req, res, next) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      // check if same given lid is refering to existing leadroom
      let result = await this.requestMgr.model.findAll({
        where: {
          leadroom_id: lid,
          requester_id: uid,
          status: 'pending'
        }
      });

      if (false === _.isEmpty(result.length)) {
        return failWith(logger, res, `Not pending request for ${lid}, ${uid}`, 400);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async validateCreate(req, res, next) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      // check if same fid,uid comb is already created
      let result = await this.requestMgr.model.findAll({
        where: {
          leadroom_id: lid,
          requester_id: uid
        }
      });

      if (false === _.isEmpty(result.length)) {
        return failWith(logger, res, `You already sent request to ${lid}, ${uid}`, 400);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

};