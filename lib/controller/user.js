import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';

export class UserController {

  constructor(
    userMgr,
    userGenreMgr
  ) {
    this.userMgr = userMgr;
    this.userGenreMgr = userGenreMgr;
  }

  async loadRequestedUserInfo(req, res, next) {
    let userid = req.params["uid"];

    let userInfo = await this.userMgr.model.findById(userid);

    if (_.isNull(userInfo)) {
      logger.info(`loadRequestedUser - userid: ${userid} not found`);
      failWith(logger, res, 'Requested User Not Found', 404);
    } else {
      _.set(req, 'info.requestedUser', userInfo);

      next();
    }
  }

  async createUser(req, res) {
    let FBUserID = req.info.FBUserID;
    let nickname = req.body.nickname;

    // create user instance
    let createdUser = this.userMgr.model.build({
      fbid: FBUserID,
      nickname: nickname
    });

    try {
      await createdUser.save();
      succeedWith(logger, res, { uid: '', fbid: FBUserID }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getUserInformation(req, res) {

  }

  async removeUser(req, res) {

  }

  async patchUser(req, res) {

  }

  async initUser(req, res) {

  }

  async checkDuplicateUser(req, res, next) {
    // do nothing yet
    next();
  }

  validateAuthInfo(req, res, next) {
    if (_.isUndefined(req.body.provider)) {
      return failWith(logger, res, 'Required Field req.body.provider not found', 400);
    }
    let authType = req.body.provider;
    if (KAKAO_AUTH_TYPE === authType) {
      if (_.isUndefined(req.body.access_token)) {
        return failWith(logger, res, 'Registering with KakaoTalk requires req.body.access_token', 400);
      } else {
        // param check passed
        return next();
      }
    } else if (EMAIL_AUTH_TYPE === authType) {
      if (_.isUndefined(req.body.email) || _.isUndefined(req.body.password)) {
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
    if (_.isUndefined(req.body.nickname)) {
      return failWith(logger, res, 'Required Field req.body.nickname not found', 400);
    }

    this.validateAuthInfo(req, res, next);
  }
};