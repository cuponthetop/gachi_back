import express from 'express';

import { UserController } from '../../controller/user';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let user = express();

  let userCtrl = args.userCtrl;

   /**
    * @api {post} /api/v1/users Create a user
    * @apiDescription 게임 생성
    * @apiName CreateUser
    * @apiGroup userController
    * @apiHeader {string} Authorization 인증 토큰
    *
    * @apiExample Example usage:
    *    endpoint: /api/v1/user
    *
    *    body:
    *    {
    *      "name":"testusertt",
    *      "description":"test"
    *    }
    * @apiParam {string} name 유저 이름
    * @apiParam {string} description 게임 설명
    *
    * @apiSuccess {json} id 생성된 유저의 ID
    * @apiSuccessExample Success-Response:
    *    HTTP/1.1 200 OK
    *    {
    *      "id": "1"
    *    }
    *
    * @apiError {string} InternalServerError 알 수 없는 오류 발생
    */
   user.post('/',
     userCtrl.createUser.bind(userCtrl)
   );

   /**
    * @api {get} /api/v1/user/:uid get user information
    * @apiDescription 유저 정보 받아오기
    * @apiName GetUserInformation
    * @apiGroup UserController
    * @apiHeader {string} Authorization 인증 토큰
    *
    * @apiExample Example usage:
    *    endpoint: /api/v1/user/1
    *
    * @apiParam {string} uid 정보를 가져오고자 하는 유저의 id
    *
    * <table>
    * <tr>
    * <th>Field Name</th>
    * <th>설명</th>
    * </tr>
    * <tr>
    * <td>id</td>
    * <td>게임 ID</td>
    * </tr>
    * <tr>
    * <td>name</td>
    * <td>게임 이름</td>
    * </tr>
    * <tr>
    * <td>description</td>
    * <td>게임 설명</td>
    * </tr>
    * <tr>
    * <td>members</td>
    * <td>게임 사용자 그룹(그룹 ID, role 정보 포함)</td>
    * </tr>
    * <tr>
    * <td>creator</td>
    * <td>게임 생성자</td>
    * </tr>
    * </table>
    *
    * @apiSuccess {json} fields 유저 정보
    * @apiSuccessExample Success-Response:
    *    HTTP/1.1 200 OK
    *    {
    *    }
    *
    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
    * @apiError {string} InternalServerError 알 수 없는 오류 발생
    * @apiError {string} UserNotFoundError 해당 유저를 찾을 수 없음
    */
   user.get('/:uid',
     userCtrl.loadRequesteduserInfo.bind(userCtrl),
     userCtrl.getUserInformation.bind(userCtrl)
   );

   /**
    * @api {delete} /api/v1/user/:uid Remove a user
    * @apiDescription 사용자 제거
    * @apiName RemoveUser
    * @apiGroup UserController
    * @apiHeader {string} Authorization 인증 토큰
    *
    * @apiExample Example usage:
    *    endpoint: /api/v1/user/1
    *
    * @apiParam {string} uid 제거하고자 하는 유저의 ID
    *
    * @apiSuccess {null} null
    * @apiSuccessExample Success-Response:
    *    HTTP/1.1 200 OK
    *
    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
    * @apiError {string} InternalServerError 알 수 없는 오류 발생
    * @apiError {string} UserNotFoundError 사용자를 찾을 수 없음
    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
    */
   user.delete('/:uid',
     userCtrl.loadRequesteduserInfo.bind(userCtrl),
     userCtrl.removeUser.bind(userCtrl)
   );

   /**
    * @api {patch} /api/v1/user/:uid Update User Information 
    * @apiDescription 유저 정보 갱신
    * @apiName UpdateUser
    * @apiGroup UserController
    * @apiHeader {string} Authorization 인증 토큰
    *
    * @apiExample Example usage:
    *    endpoint: /api/v1/user/1
    *
    *    body: {}
    * @apiParam {string} uid 갱신하고자 하는 유저의 ID
    *
    * @apiSuccess {null} null
    * @apiSuccessExample Success-Response:
    *    HTTP/1.1 200 OK
    *
    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
    * @apiError {string} InternalServerError 알 수 없는 오류 발생
    * @apiError {string} UserNotFoundError 유저를 찾을 수 없음
    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
    */
   user.patch('/:uid',
     userCtrl.loadRequesteduserInfo.bind(userCtrl),
     userCtrl.patchUser.bind(userCtrl)
   );

  return user;
}