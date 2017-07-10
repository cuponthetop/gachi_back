import { Game as GameModel, GameManager, defaultRoles } from '../model/user';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';


export class GameController {

  constructor(
    private gameMgr,
    private rottweilerURL
  ) { }

  async loadRequestedUserInfo(req, res, next) {
    let userid = req.params["uid"];

    let userInfo = await this.userMgr.get(userid);

    if (_.isNull(userInfo)) {
      logger.info(`loadRequestedUser - userid: ${userid} not found`);
      failWith(res, 'Requested User Not Found', 404);
    } else {
      _.set(req, 'info.requestedUser', userInfo);

      next();
    }
  }

  async getUser(req, res) {
    let userInfo = req.info.requestedUser;

    let fields: string[] = req.query.fields;
    let fieldsToOmit: string[] = [

    ];

    try {
      let ret = await skeletalGet(logger, fields, fieldsToOmit, userInfo);

      succeedWith(res, ret, 200);
    } catch (e) {
      if (e.message === 'Field Selector should be provided with array of strings') {
        succeedWith(res, {}, 200);
      } else {
        failWith(res, e.message, 500);
      }
    }
  }

};