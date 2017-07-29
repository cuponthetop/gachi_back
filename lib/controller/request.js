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
    // @TODO
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

  async getRequestList(req, res) {

  }

  async createRequest(req, res) {
    try {
      succeedWith(logger, res, null, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async cancelRequest(req, res) {

  }

  async refuseRequest(req, res) {

  }

  async acceptRequest(req, res) {

  }

};