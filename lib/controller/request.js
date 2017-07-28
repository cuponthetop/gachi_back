import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class RequestController {

  constructor(
    userMgr,
    festivalMgr,
    leadroomMgr,
    requestMgr
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.leadroomMgr = leadroomMgr;
    this.requestMgr = requestMgr;
  }

  async loadTargetRequestInfo(req, res, next) {
  }

  async getRequestList(req, res) {

  }

  async createRequest(req, res) {

  }

  async cancelRequest(req, res) {

  }

  async refuseRequest(req, res) {

  }

  async acceptRequest(req, res) {

  }

};