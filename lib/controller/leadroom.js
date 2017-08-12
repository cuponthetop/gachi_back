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
    fbApp,
  ) {
    this.userMgr = userMgr;
    this.festivalMgr = festivalMgr;
    this.leadroomMgr = leadroomMgr;
    this.leadroomMemberMgr = leadroomMemberMgr;
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
    let targetFID = _.get(req.query, 'fid', null);
    // TODO: ADD pagination, limit
    // TODO: check members, member count
    try {
      let result = await this.leadroomMgr.model.findAll({
        where: {
          $and: [
            {
              fid: targetFID
            }, {
              lead_until: {
                $gt: new Date()
              }
            }
          ]
        },
        // include: [
        //   {
        //     model: this.leadroomMemberMgr.model,
        //     through: { attributes: [] }
        //   }]
      });
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getLeadroom(req, res) {
    // TODO: check result matching with getleaderroomlist
    let leadroom = _.get(req.info, 'targetLeadroom', null);
    let members = [];
    try {
      members = await this.leadroomMemberMgr.model.findAll({
        where: {
          leadroom_id: leadroom.leadroom_id
        }
      });
      leadroom.member = members;

      succeedWith(logger, res, leadroom, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async createLeadroom(req, res) {
    let targetFID = _.get(req.body, 'fid', null);
    let uid = _.get(req.info, 'requestingUserID', null);
    let fbid = _.get(req.info, 'requestingFBUserID', null);
    let userInfo = _.get(req.info, 'requestingUserInfo', null);

    let max_follower = _.get(req.body, 'max_follower', 4);
    let lead_from = _.get(req.body, 'from', null);
    let lead_until = _.get(req.body, 'until', null);
    let age = _.get(req.body, 'age', '');
    let characteristic = _.get(req.body, 'characteristic', '');
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

      await newLeadroom.addMember(uid);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    // create chatroom/member
    try {
      let db = this.fbApp.database();
      let chatRef = db.ref("chat/" + newLeadroom.leadroom_id);
      await chatRef.set({ status: true, msg: [], members: [] });
      let msgRef = chatRef.child("msg");
      let membersRef = chatRef.child("members");

      await msgRef.push({ userid: 'system', username: 'system', text: '채팅방을 생성하였습니다.', timestamp: Date.now() });
      await membersRef.push({ uid: uid, fbid: fbid, username: userInfo.nickname });

      succeedWith(logger, res, { leadroom_id: newLeadroom.leadroom_id }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async removeLeadroom(req, res) {
    let leadroom = _.get(req.info, 'targetLeadroom', null);

    // remove chatroom/member
    try {
      let db = this.fbApp.database();
      let chatRef = db.ref("chat/" + leadroom.leadroom_id);
      let msgRef = chatRef.ref("msg");
      let membersRef = chatRef.ref("members");
      await chatRef.set({ status: false });

      await msgRef.remove();
      await membersRef.remove();

      succeedWith(logger, res, {}, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async updateLeadroom(req, res) {
    let uid = _.get(req.info, 'requestingUserID', null);
    let userInfo = _.get(req.info, 'requestingUserInfo', null);
    let leadroom = _.get(req.info, 'targetLeadroom', null);

    let max_follower = _.get(req.body, 'max_follower', leadroom.max_follower);
    let lead_from = _.get(req.body, 'from', leadroom.from);
    let lead_until = _.get(req.body, 'until', leadroom.until);
    let age = _.get(req.body, 'age', leadroom.age);
    let characteristic = _.get(req.body, 'characteristic', leadroom.characteristic);
    let location = _.get(req.body, 'location', leadroom.location);
    let detail = _.get(req.body, 'detail', leadroom.detail);

    try {
      leadroom.set({
        max_follower,
        lead_from,
        lead_until,
        age,
        characteristic,
        location,
        detail
      });
      await leadroom.save();
      return succeedWith(logger, res, null, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async exitLeadroom(req, res) {
    let uid = _.get(req.info, 'requestingUserID', null);
    let fbid = _.get(req.info, 'requestingFBUserID', null);
    let userInfo = _.get(req.info, 'requestingUserInfo', null);
    let leadroom = _.get(req.info, 'targetLeadroom', null);

    try {
      await leadroom.removeMember(uid);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    // exit chatroom/member
    try {
      let db = this.fbApp.database();
      let chatRef = db.ref("chat/" + leadroom.leadroom_id);
      let msgRef = chatRef.ref("msg");
      let membersRef = chatRef.ref("members");

      await msgRef.push({ userid: 'system', username: 'system', text: `${userInfo.nickname}님이 채팅방에서 나가셨습니다.`, timestamp: Date.now() });

      let member = await membersRef.orderByChild('uid').equalTo(uid).once('value')
      await member.remove();

      succeedWith(logger, res, { leadroom_id: leadroom.leadroom_id }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  validateLeadroomFields(req, res, next) {
    let max_follower = _.get(req.body, 'max_follower', null);
    let lead_from = _.get(req.body, 'from', null);
    let lead_until = _.get(req.body, 'until', null);
    let age = _.get(req.body, 'age', '');
    let characteristic = _.get(req.body, 'characteristic', '');
    let location = _.get(req.body, 'location', '');
    let detail = _.get(req.body, 'detail', '');

    if (_.isNull(lead_from) || _.isNull(lead_until)) {
      return failWith(logger, res, `body.from and body.until is required to create a Leadroom`, 400);
    }

    if (lead_from > lead_until) {
      return failWith(logger, res, `body.from must be smaller than body.until`, 400);
    }

    if (max_follower < 1) {
      return failWith(logger, res, `${max_follower} is not a valid number of members in leadroom`, 400);
    }

    return next();
  }

  async validateCreate(req, res, next) {
    let targetFID = _.get(req.body, 'fid', null);
    let uid = _.get(req.info, 'requestingUserID', null);

    if (_.isNull(targetFID) || _.isNull(uid)) {
      return failWith(logger, res, `body.fid and requesting user is required to create a Leadroom`, 400);
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

  allowLeader(req, res, next) {
    let uid = _.get(req.info, 'requestingUserID', null);
    let leadroom = _.get(req.info, 'targetLeadroom', null);

    if (uid !== leadroom.leader_id) {
      return failWith(logger, res, 'You are not a leader', 403);
    } else {
      return next();
    }
  }
};