import * as express from 'express';

import { UserController } from '../../controller/user';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let user = express();

  let userCtrl = args.userCtrl;

//   /**
//    * @api {post} /api/v1/games Create a game
//    * @apiDescription 게임 생성
//    * @apiName CreateGame
//    * @apiGroup GameController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games
//    *
//    *    body:
//    *    {
//    *      "name":"testgamett",
//    *      "description":"test"
//    *    }
//    * @apiParam {string} name 게임 이름
//    * @apiParam {string} description 게임 설명
//    *
//    * @apiSuccess {json} id 생성된 게임의 ID
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *    {
//    *      "id": "93235b685b6b346bc60fb47e277daa5f"
//    *    }
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    */
//   game.post('/',
//     gameCtrl.createGame.bind(gameCtrl)
//   );

//   /**
//    * @api {post} /api/v1/games/:gid/role/:roleid/member Add a member to the game with the role
//    * @apiDescription 게임에 사용자 추가
//    * @apiName AddMemberToGame
//    * @apiGroup RoleController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/8f02840880967fa09ffeea61bf42cd3d/role/testrole/member
//    *
//    *    body:
//    *    {
//    *      "userID":"userID"
//    *    }
//    * @apiParam {string} gid 사용자를 추가할 게임 ID
//    * @apiParam {string} roleid 추가할 사용자가 가질 권한(role) 이름
//    * @apiParam {string} userID 추가할 사용자의 User ID
//    *
//    * @apiSuccess {null} null
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} RoleNotFoundError 권한(role)을 찾을 수 없음
//    * @apiError {string} UserNotFoundError 사용자를 찾을 수 없음
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.post('/:gid/role/:roleid/member',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'admin'),
//     roleCtrl.addMember.bind(roleCtrl)
//   );

//   /**
//    * @api {post} /api/v1/games/:gid/role Create a role to the game
//    * @apiDescription 게임에 권한(role) 생성
//    * @apiName CreateRoleToGame
//    * @apiGroup RoleController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/51e135221c6d85392c3ab4712d41dfc6/role
//    *
//    *    body:
//    *    {
//    *      "role":"testrole"
//    *    }
//    * @apiParam {string} gid 권한(role)을 추가할 게임 ID
//    * @apiParam {string} role 추가할 권한(role) 이름
//    *
//    * @apiSuccess {null} null
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} RoleAlreadyExistError 권한(role)이 이미 생성되어 있음
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.post('/:gid/role',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'admin'),
//     roleCtrl.createRole.bind(roleCtrl)
//   );

//   /**
//    * @api {delete} /api/v1/games/:gid/role/:roleid/member/:memberid Remove a role from the member of the game
//    * @apiDescription 사용자에게서 게임 권한(role) 제거
//    * @apiName RemoveRoleFromMember
//    * @apiGroup RoleController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/48e62fc2d1286912372d73e7ba713624/role/testrole/member/userid
//    *
//    *    body: {}
//    * @apiParam {string} gid 권한(role)를 추가할 게임 ID
//    * @apiParam {string} roleid 권한(role) 이름
//    * @apiParam {UserID} memberid 사용자 ID
//    *
//    * @apiSuccess {null} null
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} RoleNotFoundError 권한(role)을 찾을 수 없음
//    * @apiError {string} UserNotFoundError 사용자를 찾을 수 없음
//    * @apiError {string} CannotRemoveError 제거할 수 없는 권한(role)
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.delete('/:gid/role/:roleid/member/:memberid',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'admin'),
//     roleCtrl.removeMember.bind(roleCtrl)
//   );

//   /**
//    * @api {delete} /api/v1/games/:gid/role/:roleid Delete a role from the game
//    * @apiDescription 게임 권한(role) 삭제
//    * @apiName DeleteRoleFromGame
//    * @apiGroup RoleController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/cb08749d5bdecc3502527c0b6b4d68c7/role/testrole
//    *
//    *    body: {}
//    * @apiParam {string} gid 권한(role)를 추가할 게임 ID
//    * @apiParam {string} roleid 권한(role) 이름
//    *
//    * @apiSuccess {null} null
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} RoleNotFoundError 권한(role)을 찾을 수 없음
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.delete('/:gid/role/:roleid',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'admin'),
//     roleCtrl.removeRole.bind(roleCtrl)
//   );

//   /**
//    * @api {get} /api/v1/games/:gid?fields=value Get information of the game
//    * @apiDescription 게임 정보 가져오기
//    * @apiName GetGame
//    * @apiGroup GameController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/9e825759c51f14adec92eb2a3332b66a?fields=description&fields=members
//    *
//    *    body: {}
//    * @apiParam {string} gid 게임 ID
//    * @apiParam {string[]} fields 가져올 게임 정보(property)
//    * <table>
//    * <tr>
//    * <th>Field Name</th>
//    * <th>설명</th>
//    * </tr>
//    * <tr>
//    * <td>id</td>
//    * <td>게임 ID</td>
//    * </tr>
//    * <tr>
//    * <td>name</td>
//    * <td>게임 이름</td>
//    * </tr>
//    * <tr>
//    * <td>description</td>
//    * <td>게임 설명</td>
//    * </tr>
//    * <tr>
//    * <td>members</td>
//    * <td>게임 사용자 그룹(그룹 ID, role 정보 포함)</td>
//    * </tr>
//    * <tr>
//    * <td>creator</td>
//    * <td>게임 생성자</td>
//    * </tr>
//    * </table>
//    *
//    * @apiSuccess {json} fields 게임 정보
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *    {
//    *      "description": "",
//    *      "members": [
//    *        {
//    *          "role":"read",
//    *          "groupID":"2375f4654a3a697e41019bf5ac4dd194_read"
//    *        }
//    *      ]
//    *    }
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.get('/:gid',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'read'),
//     gameCtrl.getGame.bind(gameCtrl)
//   );

//   /**
//    * @api {patch} /api/v1/games/:gid Update the game infomation
//    * @apiDescription 게임 정보 변경(members, creator 변경 불가능)
//    * @apiName UpdateGame
//    * @apiGroup GameController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/cb08749d5bdecc3502527c0b6b4d68c7
//    *
//    *    body: {
//    *      "name": "testgamenamechanged"
//    *    }
//    * @apiParam {string} id 게임 ID
//    * @apiParam {string} name(option) 변경할 게임 이름
//    * @apiParam {string} description(option) 변경할 게임 설명
//    *
//    * @apiSuccess {null} null
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} CannotUpdateError 변경할 수 없는 정보
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.patch('/:gid',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'write'),
//     gameCtrl.updateGame.bind(gameCtrl)
//   );

//   /**
//    * @api {delete} /api/v1/games/:gid Delete the game
//    * @apiDescription 게임 삭제
//    * @apiName DeleteGame
//    * @apiGroup GameController
//    * @apiHeader {string} Authorization 인증 토큰
//    *
//    * @apiExample Example usage:
//    *    endpoint: /api/v1/games/cb08749d5bdecc3502527c0b6b4d68c7
//    *
//    *    body: {}
//    * @apiParam {string} gid 삭제할 게임 ID
//    *
//    * @apiSuccess {null} null
//    * @apiSuccessExample Success-Response:
//    *    HTTP/1.1 200 OK
//    *
//    * @apiError (5xx) {string} AuthorizationError 사용자 인증 오류
//    * @apiError {string} InternalServerError 알 수 없는 오류 발생
//    * @apiError {string} GameNotFoundError 게임을 찾을 수 없음
//    * @apiError {string} PermissionDenied 엑세스 권한(role) 제한
//    */
//   game.delete('/:gid',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     accessCtrl.isMemberOf.bind(accessCtrl, 'write'),
//     gameCtrl.removeGame.bind(gameCtrl)
//   );

//   // all project routes include game information
//   game.use('/:gid/projects',
//     gameCtrl.loadRequestedGameInfo.bind(gameCtrl),
//     project(args)
//   );

  return user;
}