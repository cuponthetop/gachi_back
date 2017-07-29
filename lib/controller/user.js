import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';
import { KAKAO_AUTH_TYPE, EMAIL_AUTH_TYPE } from './auth';

export class UserController {

  constructor(
    userMgr,
    userGenreMgr
  ) {
    this.userMgr = userMgr;
    this.userGenreMgr = userGenreMgr;
  }

  async loadTargetUserInfo(req, res, next) {
    let userid = req.params["uid"];

    let userInfo = await this.userMgr.model.findById(userid);

    if (_.isNull(userInfo)) {
      logger.info(`loadTargetUser - userid: ${userid} not found`);
      failWith(logger, res, 'Target User Not Found', 404);
    } else {
      _.set(req, 'info.targetUser', userInfo);

      next();
    }
  }

  async createUser(req, res) {
    let FBUserID = req.info.FBUserID;
    let nickname = req.body.nickname;

    try {
      // create user instance
      let createdUser = await this.userMgr.model.create({
        fbid: FBUserID,
        nickname: nickname
      });

      succeedWith(logger, res, { uid: createdUser.uid, fbid: FBUserID }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getUserInformation(req, res) {

  }

  /**
   * True if 본인이면
   * @param {*요청 보내는 유저ID} requestingUserID
   * @param {*목표 유저ID} targetUserID
   */
  checkSelf(requestingUserID, targetUserID) {
    return requestingUserID === targetUserID;
  }

  async removeUser(req, res) {
    let requestingUserID = req.body.info.requestingUserID;
    let targetUser = req.info.targetUser;

    if (this.checkSelf(requestingUserID, targetUser.uid)) {
      try {
        await targetUser.destroy();

        succeedWith(logger, res, null, 200);
      } catch (e) {
        return failWith(logger, res, e.message, 500);
      }
    } else {
      return failWith(logger, res, `${requestingUserID} is not ${targetUser.uid}, user can only remove oneself`, 403);
    }
  }

  async patchUser(req, res) {
    let requestingUserID = req.body.info.requestingUserID;
    let targetUser = req.info.targetUser;

    if (this.checkSelf(requestingUserID, targetUser.uid)) {
      try {
        // TODO:: add field check and add logic

        succeedWith(logger, res, null, 200);
      } catch (e) {
        return failWith(logger, res, e.message, 500);
      }
    } else {
      return failWith(logger, res, `${requestingUserID} is not ${targetUser.uid}, user can only patch oneself`, 403);
    }
  }

  async initUser(req, res) {
    let requestingUserID = req.body.info.requestingUserID;
    let targetUser = req.info.targetUser;

    if (this.checkSelf(requestingUserID, targetUser.uid)) {
      try {
        // TODO:: add logic

        succeedWith(logger, res, null, 200);
      } catch (e) {
        return failWith(logger, res, e.message, 500);
      }
    } else {
      return failWith(logger, res, `${requestingUserID} is not ${targetUser.uid}, user can only init oneself`, 403);
    }
  }

  async checkDuplicateUser(req, res, next) {
    // do nothing yet
    next();
  }

  validateAuthInfo(req, res, next) {
    if ((_.isUndefined(req.body.provider) || ("" === req.body.provider))) {
      return failWith(logger, res, 'Required Field req.body.provider not found', 400);
    }
    let authType = req.body.provider;
    if (KAKAO_AUTH_TYPE === authType) {
      if ((_.isUndefined(req.body.access_token) || ("" === req.body.access_token))) {
        return failWith(logger, res, 'Registering with KakaoTalk requires req.body.access_token', 400);
      } else {
        // param check passed
        return next();
      }
    } else if (EMAIL_AUTH_TYPE === authType) {
      if ((_.isUndefined(req.body.email) || ("" === req.body.email)) || (_.isUndefined(req.body.password) || ("" === req.body.password))) {
        return failWith(logger, res, 'Registering with Email requires email and password', 400);
      } else {
        // param check passed
        return next();
      }
    } else {
      return failWith(logger, res, `Authentication Type ${authType} is not supported`, 400);
    }
  }

  validateCreateUser(req, res, next) {
    if ((_.isUndefined(req.body.nickname)) || ("" === req.body.nickname)) {
      return failWith(logger, res, 'Required Field req.body.nickname not found', 400);
    }

    this.validateAuthInfo(req, res, next);
  }
};