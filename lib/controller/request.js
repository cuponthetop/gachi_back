import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';
import {
  includeRequester, includeLeadroom,
  includeLeadroomThenRequester, includeLeadroomAndRequesterToResults
} from '../util/request-formatter';


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

  async getRequestInfo(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);
    let request = _.get(req.info, 'targetRequest', null);

    try {
      let jsoned = await includeLeadroomThenRequester(request, request.toJSON());

      return succeedWith(logger, res, jsoned, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getSentRequestList(req, res) {
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      let result = await this.requestMgr.model.findAll({
        where: {
          requester_id: uid
        },
        // include: [{
        //   model: this.leadroomMgr.model,
        //   as: 'leadroom'
        // }]
      });

      let jsoned = await includeLeadroomAndRequesterToResults(result);

      succeedWith(logger, res, jsoned, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getReceivedRequestList(req, res) {
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      let result = await this.requestMgr.model.findAll({
        where: {
          status: 'pending'
        },
        include: [{
          model: this.leadroomMgr.model,
          as: 'leadroom',
          where: {
            leader_id: uid
          }
        }]
      });

      let jsoned = await includeLeadroomAndRequesterToResults(result);

      succeedWith(logger, res, jsoned, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async createRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      let newRequest = await this.requestMgr.model.create({
        leadroom_id: lid,
        requester_id: uid,
        status: 'pending'
      });

      succeedWith(logger, res, { lid, uid, rid: newRequest.rid }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async cancelRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);
    let request = _.get(req.info, 'targetRequest', null);

    try {
      let updateRes = await request.update({ status: 'canceled' });
      succeedWith(logger, res, updateRes, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async refuseRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let request = _.get(req.info, 'targetRequest', null);

    try {
      let updateRes = await request.update({ status: 'rejected' });
      succeedWith(logger, res, updateRes, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async acceptRequest(req, res) {
    let lid = _.get(req.body, 'lid', null);
    let request = _.get(req.info, 'targetRequest', null);
    let requester_id = request.requester_id;

    let updateRes = null;
    try {
      updateRes = await request.update({ status: 'accepted' });
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      let leadroom = await request.getLeadroom();
      await leadroom.addMember(requester_id);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      // retrieve requester info
      let requester = await this.userMgr.model.findById(requester_id);

      if (_.isNull(requester)) {
        return failWith(logger, res, 'requester not found, clean up not done!!!', 500);
      }

      // add requester to chatroom member
      let db = this.fbApp.database();
      let chatRef = db.ref("chat/" + lid);
      let msgRef = chatRef.child("msg");
      let membersRef = chatRef.child("members");

      await msgRef.push({ userid: 'system', username: 'system', text: `${requester.nickname}님이 입장하셨습니다.`, timestamp: Date.now() });
      await membersRef.push({ uid: requester.uid, fbid: requester.fbid, username: requester.nickname });

      succeedWith(logger, res, updateRes, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async validateExistingLeadroomAndNonLeader(req, res, next) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    if (_.isNull(lid)) {
      return failWith(logger, res, `body.lid is required to send a request to a Leadroom`, 400);
    }

    try {
      // check if same given lid is refering to existing leadroom
      let result = await this.leadroomMgr.model.findById(lid);

      if (_.isNull(result)) {
        return failWith(logger, res, `Not existing ${lid}`, 400);
      } else if (result.leader_id === uid) {
        return failWith(logger, res, `Requesting user is leader of ${lid}`, 400);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async validatePendingRequest(req, res, next) {
    let request = _.get(req.info, 'targetRequest', null);

    if ('pending' !== request.status) {
      return failWith(logger, res, `request is in ${request.status} status`, 500);
    }

    next();
  }

  async allowLeader(req, res, next) {
    let lid = _.get(req.body, 'lid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    try {
      // check if same given lid is refering to existing leadroom
      let result = await this.leadroomMgr.model.findById(lid);

      if (_.isNull(result)) {
        return failWith(logger, res, `Found no valid leadroom : ${lid}`, 400);
      } else if (result.leader_id !== uid) {
        return failWith(logger, res, `${uid} is not leader of leadroom : ${lid}`, 403);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async allowOwner(req, res, next) {
    let uid = _.get(req.info, 'requestingUserID', null);
    let request = _.get(req.info, 'targetRequest', null);

    if (request.requester_id !== uid) {
      return failWith(logger, res, `${uid} is not requester of ${request.rid}`, 403);
    } else {
      next();
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

      if (0 !== result.length) {
        return failWith(logger, res, `You already sent request to ${lid}, ${uid}`, 400);
      } else {
        next();
      }
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

};