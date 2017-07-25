import * as rq from 'request-promise';
import { User as UserModel, UserManager } from '../model/user';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { logger } from '../util/logger';

// Kakao API request url to retrieve user profile based on access token
const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v1/user/me';
const KAKAO_PROVIDER_ID = 'KAKAO';

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

async function createEmailUser(fbApp, email, password) {
  try {
    return fbApp.auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    if (error.code == 'auth/weak-password') {
      throw Error('The password is too weak.');
    } else {
      throw Error(error.message);
    }
  }
}

async function createKakaoUser(fbApp, accessToken) {
  let kakakoInfo = await retrieveKakaoUserInfo(accessToken);

  const body = JSON.parse(res);
  const userID = `kakao:${body.id}`;
  if (!userID) {
    throw Error('There was no user with the given access token.');
  }

  try {
    return await createFBUserWhenNotFound(fbApp, userID, body.kaccount_email);
  } catch (error) {
    throw error;
  }
}

/**
 * retrieveKakaoUserInfo - Returns user profile from Kakao API
 *
 * @param  {String} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promiise<Response>}      User profile response in a promise
 */
function retrieveKakaoUserInfo(kakaoAccessToken) {
  logger.log(`Requesting user profile from Kakao API server for ${kakaoAccessToken}`);
  return request({
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + kakaoAccessToken },
    url: KAKAO_USER_INFO_URL,
  });
};


/**
 * updateOrCreateUser - Update Firebase user with the given email, create if
 * none exists.
 * @return {Prommise<UserRecord>} Firebase user record in a promise
 */
async function createFBUserWhenNotFound(fbApp, userID, email) {
  logger.log('creating a firebase user for Kakaotalk when not found (already existing)');
  try {
    return await fbApp.auth().getUser(userID);
  } catch (error) {

    if (error.code === 'auth/user-not-found') {
      try {
        return await fbApp.auth().createUser({ uid: userID, email });
      } catch (secondError) {
        throw secondError;
      }
    }
  }
};

/**
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK
 *
 * @param  {String} kakaoAccessToken access token from Kakao Login API
 * @return {Promise<String>}                  Firebase token in a promise
 */
async function createFirebaseToken(fbApp, kakaoAccessToken) {
  let res = await requestMe(kakaoAccessToken)

  const body = JSON.parse(res);
  const userID = `kakao:${body.id}`;
  console.log(`creating a custom firebase token based on uid ${userID}`);
  return await self.fbApp.auth().createCustomToken(userID, { provider: KAKAO_PROVIDER_ID });
};