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

  async loadRequestedLeadroomInfo(req, res, next) {
  }


};