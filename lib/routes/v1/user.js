import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let user = express();

  let userCtrl = args.userCtrl;
  let authCtrl = args.authCtrl;

  /**
   * @api {post} /api/v1/users/login Login as a user
   * @apiDescription 가치 유저 로그인 - 가치에서 사용하는 UserID를 반환한다
   * @apiName LoginUser
   * @apiGroup UserController
   *
   * @apiExample Example usage:
   *    Kakao 유저 로그인 -
   *    endpoint: /api/v1/user
   *
   *    header:
   *    {
   *      "authorization": "Bearer some_access_token"
   *    }
   *
   * @apiParam {String} authorization 유저의 Firebase 액세스 토큰
   *
   * @apiSuccess {Bool} success True if successful
   * @apiSuccess {String} uid 가치 유저 아이디
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "success": true,
   *      "uid": "sample_userid"
   *    }
   *
   * @apiError {String} InternalServerError 알 수 없는 오류 발생
   */
  user.get('/login',
    // userCtrl.validateAuthInfo.bind(userCtrl),
    // authCtrl.login.bind(authCtrl)
    authCtrl.authenticate.bind(authCtrl),
    userCtrl.getUserID.bind(userCtrl),
  );

  /**
   * @api {post} /api/v1/users Create a user
   * @apiDescription 가치 유저 생성
   * @apiName CreateUser
   * @apiGroup UserController
   *
   * @apiExample Example usage:
   *    Kakao 유저 생성 -
   *    endpoint: /api/v1/user
   *
   *    body:
   *    {
   *      "provider": "KAKAO",
   *      "access_token":"kakao_access_token",
   *      "nickname":"kakao"
   *    }
   *
   *    Email/Password 유저 생성 -
   *    endpoint: /api/v1/user
   *    body:
   *    {
   *      "provider": "email",
   *      "email":"email_address",
   *      "password": "hashed_password?"
   *      "nickname":"email"
   *    }
   * @apiParam {String} provider 유저의 인증 타입 (kakao/email)
   * @apiParam {String} nickname 공통 필수 유저의 닉네임
   * @apiParam {String} access_token kakao 인증의 경우 카카오톡의 인증 토큰
   * @apiParam {String} email email 인증의 경우 유저 이메일 주소
   * @apiParam {String} password email 인증의 경우 유저 비밀번호
   *
   * @apiSuccess {Boolean} success true if successful
   * @apiSuccess {String} id 생성된 유저의 ID
   * @apiSuccess {String} fbid 생성된 유저의 Firebase ID
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "success": true,
   *      "uid": "1",
   *      "fbid": "sample_fb_id"
   *    }
   *
   * @apiError {String} InternalServerError 알 수 없는 오류 발생
   */
  user.post('/',
    userCtrl.validateCreateUser.bind(userCtrl),
    userCtrl.checkDuplicateUser.bind(userCtrl),
    authCtrl.createFBUser.bind(authCtrl),
    userCtrl.createUser.bind(userCtrl)
  );

  user.get('/check',
    userCtrl.checkNicknameAvailability.bind(userCtrl)
  );

  /**
   * @api {get} /api/v1/user/:uid Get User Information
   * @apiDescription 유저 정보 받아오기
   * @apiName GetUserInformation
   * @apiGroup UserController
   * @apiHeader {String} Authorization FB 인증 토큰
   *
   * @apiExample Example usage:
   *    endpoint: /api/v1/user/1
   *
   * @apiParam {String} uid 정보를 가져오고자 하는 유저의 id
   * @apiSuccess {json} fields 유저 정보
   *
   * <table>
   * <tr>
   * <th>Field Name</th>
   * <th>설명</th>
   * </tr>
   * <tr>
   * <td>uid</td>
   * <td>유저 ID</td>
   * </tr>
   * <tr>
   * <td>fbid</td>
   * <td>유저 Firebase id</td>
   * </tr>
   * <tr>
   * <td>nickname</td>
   * <td>유저 닉네임</td>
   * </tr>
   * <tr>
   * <td>age</td>
   * <td>유저 나이</td>
   * </tr>
   * <tr>
   * <td>gender</td>
   * <td>유저 성별</td>
   * </tr>
   * <tr>
   * <td>location</td>
   * <td>유저 지역</td>
   * </tr>
   * <tr>
   * <td>genre</td>
   * <td>유저 선호 장르</td>
   * </tr>
   * <tr>
   * <td>reliability</td>
   * <td>유저 신뢰도</td>
   * </tr>
   * <tr>
   * <td>leadrooms</td>
   * <td>현재 참여 중인 대화 [대화방 ID, [<참여자 ID, 참여자 FB ID>]]</td>
   * </tr>
   * <tr>
   * <td>history</td>
   * <td>참여했던 페스티벌 [페스티벌ID]</td>
   * </tr>
   * </table>
   *
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *    }
   *
   * @apiError (5xx) {String} AuthorizationError 사용자 인증 오류
   * @apiError {String} InternalServerError 알 수 없는 오류 발생
   * @apiError {String} UserNotFoundError 해당 유저를 찾을 수 없음
   */
  user.get('/:uid',
    authCtrl.authenticate.bind(authCtrl),
    userCtrl.loadTargetUserInfo.bind(userCtrl),
    userCtrl.getUserInformation.bind(userCtrl)
  );

  /**
   * @api {delete} /api/v1/user/:uid Remove a user
   * @apiDescription 사용자 제거
   * @apiName RemoveUser
   * @apiGroup UserController
   * @apiHeader {String} Authorization 인증 토큰
   *
   * @apiExample Example usage:
   *    endpoint: /api/v1/user/1
   *
   * @apiParam {String} uid 제거하고자 하는 유저의 ID
   *
   * @apiSuccess {Boolean} success true if successful
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *
   * @apiError (5xx) {String} AuthorizationError 사용자 인증 오류
   * @apiError {String} InternalServerError 알 수 없는 오류 발생
   * @apiError {String} UserNotFoundError 사용자를 찾을 수 없음
   * @apiError {String} PermissionDenied 엑세스 권한(role) 제한
   */
  user.delete('/:uid',
    authCtrl.authenticate.bind(authCtrl),
    userCtrl.loadTargetUserInfo.bind(userCtrl),
    userCtrl.removeUser.bind(userCtrl)
  );

  /**
   * @api {patch} /api/v1/user/:uid/initial Update Initial User Information
   * @apiDescription 유저 초기 정보 추가
   * @apiName InitUser
   * @apiGroup UserController
   * @apiHeader {String} Authorization 인증 토큰
   *
   * @apiExample Example usage:
   *    endpoint: /api/v1/user/1/initial
   *
   *    body: {
   *      step: 1,
   *      nickname: '22'
   *    }
   *    body: {
   *      step: 2,
   *      age: '22'
   *    }
   *    body: {
   *      step: 3,
   *      gender: 'male'
   *    }
   *    body: {
   *      step: 4,
   *      location: '서울'
   *    }
   *    body: {
   *      step: 5,
   *      genre: ['콘서트', '개그콘서트']
   *    }
   * @apiParam {String} uid 갱신하고자 하는 유저의 ID
   *
   * @apiSuccess {Boolean} success true if successful
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *
   * @apiError (5xx) {String} AuthorizationError 사용자 인증 오류
   * @apiError {String} InternalServerError 알 수 없는 오류 발생
   * @apiError {String} UserNotFoundError 유저를 찾을 수 없음
   * @apiError {String} PermissionDenied 엑세스 권한(role) 제한
   */
  user.patch('/:uid/initial',
    authCtrl.authenticate.bind(authCtrl),
    userCtrl.loadTargetUserInfo.bind(userCtrl),
    userCtrl.initUser.bind(userCtrl)
  );

  user.patch('/:uid/rate',
    authCtrl.authenticate.bind(authCtrl),
    userCtrl.validateRateUser.bind(userCtrl),
    userCtrl.loadTargetUserInfo.bind(userCtrl),
    userCtrl.rateUser.bind(userCtrl)
  );

  /**
   * @api {patch} /api/v1/user/:uid Update User Information
   * @apiDescription 유저 정보 갱신
   * @apiName UpdateUser
   * @apiGroup UserController
   * @apiHeader {String} Authorization 인증 토큰
   *
   * @apiExample Example usage:
   *    endpoint: /api/v1/user/1
   *
   *    body: {}
   * @apiParam {String} uid 갱신하고자 하는 유저의 ID
   *
   * @apiSuccess {Boolean} success true if successful
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *
   * @apiError (5xx) {String} AuthorizationError 사용자 인증 오류
   * @apiError {String} InternalServerError 알 수 없는 오류 발생
   * @apiError {String} UserNotFoundError 유저를 찾을 수 없음
   * @apiError {String} PermissionDenied 엑세스 권한(role) 제한
   */
  user.patch('/:uid',
    authCtrl.authenticate.bind(authCtrl),
    userCtrl.loadTargetUserInfo.bind(userCtrl),
    userCtrl.patchUser.bind(userCtrl)
  );

  return user;
}