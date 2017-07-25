import { User as UserModel, UserManager } from '../model/user';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { logger } from '../util/logger';

import {
  createKakaoUser, createFirebaseToken
} from '../util/kakao-auth';
import { createEmailUser } from '../util/email-auth';


export class AuthController {

  constructor(
    fbApp
  ) { }

  async createUser(req, res) {
    if (_.isUndefined(req.body.provider)) {
      return failWith(logger, res, 'Required Field req.body.provider not found', 400);
    }
    let authType = req.body.provider;
    if ("KAKAO" === authType) {
      if (_.isUndefined(req.body.access_token)) {
        return failWith(logger, res, 'Registering with KakaoTalk requires req.body.access_token', 400);
      } else {
        // param check passed
        try {
          let kakaoUserInfo = await createKakaoUser(this.fbApp, req.body.access_token);
          return succeedWith(localStorage, res, { success: true, uid: kakaoUserInfo.uid }, 200);
        } catch (error) {
          return failWith(logger, res, error.message, 400);
        }
      }
    } else if ("email") {
      if (_.isUndefined(req.body.email) || _.isUndefined(req.body.password)) {
        return failWith(logger, res, 'Registering with Email requires email and password', 400);
      } else {
        // param check passed
        try {
          // user creation in firebase-side is done
          let createdUser = await createEmailUser(this.fbApp, req.body.email, req.body.password);
          return succeedWith(localStorage, res, { success: true, uid: createdUser.uid }, 200);
        } catch (error) {
          return failWith(logger, res, error.message, 400);
        }
      }
    } else {
      return failWith(logger, res, `Authentication Type ${authType} is not supported`, 400);
    }
  }

  async authenticate(req, res, next) {
    if (_.isUndefined(req.body.access_token)) {
      return failWith(logger, res, 'Required Field req.body.access_token not found', 400);
    }

    try {
      let userInfo = await this.fbApp.verifyIDToken(req.body.access_token);
      _.set(req, 'body.info.requestedUserID', userInfo.uid);
      // move on to next step
      next();
    } catch (error) {
      // token verification failed
      logger.debug(error.message);
      failWith(logger, res, error.message, 403);
    }
  }

  async login(req, res) {
    if (_.isUndefined(req.body.provider)) {
      return failWith(logger, res, 'Required Field req.body.provider not found', 400);
    }
    let authType = req.body.provider;
    if ("KAKAO" === authType) {
      if (_.isUndefined(req.body.access_token)) {
        return failWith(logger, res, 'Registering with KakaoTalk requires req.body.access_token', 400);
      } else {
        // param check passed
        try {
          // TODO:: should I use signInWithCustomToken here???
          let fbToken = await createFirebaseToken(this.fbApp, req.body.access_token);
          return succeedWith(localStorage, res, { success: true, access_token: fbToken }, 200);
        } catch (error) {
          return failWith(logger, res, error.message, 400);
        }
      }
    } else if ("email") {
      if (_.isUndefined(req.body.email) || _.isUndefined(req.body.password)) {
        return failWith(logger, res, 'Registering with Email requires email and password', 400);
      } else {
        // param check passed
        try {
          // user creation in firebase-side is done
          let signedInUser = await this.fbApp.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
          let token = await signedInUser.getIDToken();
          return succeedWith(logger, res, { success: true, access_token: token }, 200);
        } catch (error) {
          return failWith(logger, res, error.message, 400);
        }
      }
    } else {
      return failWith(logger, res, `Authentication Type ${authType} is not supported`, 400);
    }
  }

};
