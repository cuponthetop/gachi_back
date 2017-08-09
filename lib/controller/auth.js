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

  async createFBUser(req, res, next) {
    let authType = req.body.provider;
    if (KAKAO_AUTH_TYPE === authType) {
      try {
        let kakaoUserInfo = await createKakaoUser(this.fbApp, req.body.access_token);
        _.set(req, 'info.FBUserID', kakaoUserInfo.uid);
        return next();
      } catch (error) {
        return failWith(logger, res, error.message, 400);
      }
    } else if (EMAIL_AUTH_TYPE === authType) {
      // param check passed
      try {
        // user creation in firebase-side is done
        let createdUser = await createEmailUser(this.fbApp, req.body.email, req.body.password);
        _.set(req, 'info.FBUserID', createdUser.uid);
        return next();
      } catch (error) {
        return failWith(logger, res, error.message, 400);
      }
    } else {
      // should have been processed on UserController.validateCreateUser
      return failWith(logger, res, `Authentication Type ${authType} is not supported`, 400);
    }
  }

  async authenticate(req, res, next) {
    if (_.isUndefined(req.body.access_token)) {
      return failWith(logger, res, 'Required Field req.body.access_token not found', 400);
    }

    try {
      let fbUserInfo = await this.fbApp.verifyIDToken(req.body.access_token);
      let userInfo = await this.userMgr.model.findOne({ where: { fbid: fbUserInfo.uid } });

      _.set(req, 'body.info.requestingFBUserID', fbUserInfo.uid);
      _.set(req, 'body.info.requestingUserID', userInfo.uid);
      _.set(req, 'body.info.requestingUserInfo', userInfo);
      // move on to next step
      next();
    } catch (error) {
      // token verification failed
      logger.debug(error.message);
      failWith(logger, res, error.message, 403);
    }
  }

  async login(req, res) {
    let authType = req.body.provider;
    if (KAKAO_AUTH_TYPE === authType) {
      // param check passed
      try {
        // TODO:: should I use signInWithCustomToken here??? -> NO signInWithCustomToken should happen in client
        let fbToken = await createFirebaseToken(this.fbApp, req.body.access_token);
        return succeedWith(logger, res, { success: true, access_token: fbToken }, 200);
      } catch (error) {
        return failWith(logger, res, error.message, 400);
      }
      // ! email users do not login through gachi_backend, only kakaotalk
      // client keep token from FB, attach it with backend requests
      // } else if (EMAIL_AUTH_TYPE === authType) {
      //   // param check passed
      //   try {
      //     // user creation in firebase-side is done
      //     let signedInUser = await this.fbApp.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
      //     let token = await signedInUser.getIDToken();
      //     return succeedWith(logger, res, { success: true, access_token: token }, 200);
      //   } catch (error) {
      //     return failWith(logger, res, error.message, 400);
      //   }
    } else {
      return failWith(logger, res, `Authentication Type ${authType} is not supported`, 400);
    }
  }

};
