let rq = require('request-promise');
import * as _ from 'lodash';
import { logger } from './logger';

// Kakao API request url to retrieve user profile based on access token
const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v1/user/me';
const KAKAO_PROVIDER_ID = 'KAKAO';

export async function createKakaoUser(fbApp, accessToken) {
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
  return rq({
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
export async function createFirebaseToken(fbApp, kakaoAccessToken) {
  let res = await retrieveKakaoUserInfo(kakaoAccessToken)

  const body = JSON.parse(res);
  const userID = `kakao:${body.id}`;
  logger.log(`creating a custom firebase token based on uid ${userID}`);
  return await fbApp.auth().createCustomToken(userID, { provider: KAKAO_PROVIDER_ID });
};