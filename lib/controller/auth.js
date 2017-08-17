import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { logger } from '../util/logger';

import {
  createKakaoUser, createFirebaseToken
} from '../util/kakao-auth';
import { createEmailUser } from '../util/email-auth';

export const KAKAO_AUTH_TYPE = "kakao";
export const EMAIL_AUTH_TYPE = "email";

export class AuthController {

  constructor(
    fbApp,
    userMgr
  ) {
    this.fbApp = fbApp;
    this.userMgr = userMgr;
  }

  async authenticate(req, res, next) {
    if (_.isUndefined(req.header('authorization'))) {
      return failWith(logger, res, 'Required Field req.header(authorization) not found', 400);
    }

    try {
      let token = req.header('authorization').replace('Bearer ', '');
      let fbUserInfo = await this.fbApp.auth().verifyIdToken(token);
      let userInfo = await this.userMgr.model.findOne({ where: { fbid: fbUserInfo.uid } });

      _.set(req, 'info.requestingFBUserID', fbUserInfo.uid);
      _.set(req, 'info.requestingUserID', userInfo.uid);
      _.set(req, 'info.requestingUserInfo', userInfo);
      // move on to next step
      next();
    } catch (error) {
      // token verification failed
      logger.debug(error.message);
      failWith(logger, res, error.message, 403);
    }
  }

  async registerOrAuthenticate(req, res, next) {
    if (_.isUndefined(req.header('authorization'))) {
      return failWith(logger, res, 'Required Field req.header(authorization) not found', 400);
    }
    let fbUserInfo = null;
    try {
      let token = req.header('authorization').replace('Bearer ', '');
      fbUserInfo = await this.fbApp.auth().verifyIdToken(token);
    } catch (error) {
      return failWith(logger, res, 'Not acceptable Token!! ' + error.message, 400);
    }

    try {
      let userInfo = await this.userMgr.model.findOne({ where: { fbid: fbUserInfo.uid } });

      if (_.isNull(userInfo)) {
        userInfo = await this.userMgr.model.create({ fbid: fbUserInfo.uid, nickname: fbUserInfo.email });
      }

      _.set(req, 'info.requestingFBUserID', fbUserInfo.uid);
      _.set(req, 'info.requestingUserID', userInfo.uid);
      _.set(req, 'info.requestingUserInfo', userInfo);
      // move on to next step
      next();
    } catch (error) {
      // token verification failed
      logger.debug(error.message);
      failWith(logger, res, error.message, 403);
    }
  }

};
