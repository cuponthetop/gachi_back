import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';
import { KAKAO_AUTH_TYPE, EMAIL_AUTH_TYPE } from './auth';
import { retrieveImage } from '../util/retrieve-image';
import { includeAllForLeadroomToResults } from '../util/leadroom-formatter';

export class UserController {

  constructor(
    userMgr,
    leadroomMgr,
    leadroomMemberMgr
  ) {
    this.userMgr = userMgr;
    this.leadroomMgr = leadroomMgr;
    this.leadroomMemberMgr = leadroomMemberMgr;
  }

  async loadTargetUserInfo(req, res, next) {
    let userid = req.params["uid"];

    let userInfo = await this.userMgr.model.findById(userid);

    if (_.isNull(userInfo)) {
      logger.info(`loadTargetUser - userid: ${userid} not found`);
      failWith(logger, res, 'Target User Not Found', 404);
    } else {
      _.set(req, 'info.targetUser', userInfo);

      next();
    }
  }

  async getUserID(req, res) {
    let requestingUserID = req.info.requestingUserID;
    return succeedWith(logger, res, { uid: requestingUserID }, 200);
  }

  async getUserInformation(req, res) {
    let requestingUserID = req.info.requestingUserID;
    let targetUser = req.info.targetUser;

    let history = [];
    let leadrooms = [];
    try {
      history = await this.leadroomMgr.model.findAll({
        where: {
          '$member.uid$': requestingUserID,
          lead_until: {
            $lt: Date.now()
          }
        },
        include: [{
          association: 'member',
          through: { attributes: [] }
        }]
      });
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      leadrooms = await this.leadroomMgr.model.findAll({
        where: {
          '$member.uid$': requestingUserID,
          lead_from: {
            $gt: Date.now()
          }
        },
        include: [{
          association: 'member'
        }]
      });
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      let result = {
        uid: targetUser.uid,
        fbid: targetUser.fbid,
        init_step: targetUser.init_step,
        profile_image: targetUser.profile_image,
        nickname: targetUser.nickname,
        age: targetUser.age,
        gender: targetUser.gender,
        location: targetUser.location,
        reliability: targetUser.reliability,
        genre: await targetUser.getGenres(),
        leadrooms: await includeAllForLeadroomToResults(leadrooms),
        history: await includeAllForLeadroomToResults(history)
      };

      return succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  /**
   * True if 본인이면
   * @param {*요청 보내는 유저ID} requestingUserID
   * @param {*목표 유저ID} targetUserID
   */
  checkSelf(requestingUserID, targetUserID) {
    return requestingUserID === targetUserID;
  }

  async removeUser(req, res) {
    let requestingUserID = req.info.requestingUserID;
    let targetUser = req.info.targetUser;

    if (this.checkSelf(requestingUserID, targetUser.uid)) {
      try {
        await targetUser.destroy();

        succeedWith(logger, res, null, 200);
      } catch (e) {
        return failWith(logger, res, e.message, 500);
      }
    } else {
      return failWith(logger, res, `${requestingUserID} is not ${targetUser.uid}, user can only remove oneself`, 403);
    }
  }

  async patchUser(req, res) {
    let requestingUserID = req.info.requestingUserID;
    let targetUser = req.info.targetUser;

    if (this.checkSelf(requestingUserID, targetUser.uid)) {
      try {
        if (false === _.isUndefined(req.body.age)) {
          targetUser.set({ age: parseInt(req.body.age) });
        }
        if (false === _.isUndefined(req.body.gender)) {
          // gender
          targetUser.set({ gender: req.body.gender });
        }
        if (false === _.isUndefined(req.body.location)) {
          // location
          targetUser.set({ location: req.body.location });
        }
        if (false === _.isUndefined(req.body.genre)) {
          // genre
          await targetUser.setGenres(req.body.genre);
        }
        if (false === _.isUndefined(req.body.profile_image)) {
          let image = '';
          let imageURL = req.body.profile_image;
          let ext = extname(imageURL);
          let binaryImage = await retrieveImage(imageURL);
          let url = await this.storageManager.uploadBinaryImage(binaryImage, targetUser.uid + ext);
          image = url;
          // image
          targetUser.set({ profile_image: image });
        }
        if (false === _.isUndefined(req.body.nickname) && this.isNicknameAvailable(req.body.nickname)) {
          // nickname
          targetUser.set({ nickname: req.body.nickname });
        }

        await targetUser.save();
        succeedWith(logger, res, null, 200);
      } catch (e) {
        return failWith(logger, res, e.message, 500);
      }
    } else {
      return failWith(logger, res, `${requestingUserID} is not ${targetUser.uid}, user can only patch oneself`, 403);
    }
  }

  async initUser(req, res) {
    let requestingUserID = req.info.requestingUserID;
    let targetUser = req.info.targetUser;
    let step = _.get(req.body, 'step', null);
    let init_step = null;

    if (step > 0 && step < 6) {
      init_step = step + 1;
    } else {
      return failWith(logger, res, `Not a valid step ${step}`, 400);
    }

    if (this.checkSelf(requestingUserID, targetUser.uid)) {
      try {
        // TODO:: add logic
        switch (step) {
          case 1: {
            // genre
            if (false === this.isNicknameAvailable(req.body.nickname)) {
              return failWith(logger, res, `nickname ${req.body.nickname} is in use`, 400);
            }
            targetUser.set({ nickname: req.body.nickname });
            break;
          }
          case 2: {
            // age
            targetUser.set({ age: parseInt(req.body.age) });
            break;
          }
          case 3: {
            // gender
            targetUser.set({ gender: req.body.gender });
            break;
          }
          case 4: {
            // location
            targetUser.set({ location: req.body.location });
            break;
          }
          case 5: {
            // genre
            targetUser.addGenres(req.body.genre);
            break;
          }
        }

        // TODO:: how to init reliability?
        let prevRel = targetUser.reliability
        targetUser.set({ reliability: prevRel + 10, init_step });

        await targetUser.save();
        succeedWith(logger, res, null, 200);
      } catch (e) {
        return failWith(logger, res, e.message, 500);
      }
    } else {
      return failWith(logger, res, `${requestingUserID} is not ${targetUser.uid}, user can only init oneself`, 403);
    }
  }

  async rateUser(req, res) {
    let requestingUserID = req.info.requestingUserID;
    let targetUser = req.info.targetUser;
    let rate = _.get(req.body, 'rate', null);
    // TODO Add festival information?? who has right to rate someone?
    // let festival = _.get(req.body, 'festival', null);

    if (false === this.checkSelf(requestingUserID, targetUser.uid)) {
      return failWith(logger, res, `Not implemented yet`, 500);
    } else {
      return failWith(logger, res, `${requestingUserID} is ${targetUser.uid}, you cannot rate yourself`, 403);
    }
  }

  async checkDuplicateUser(req, res, next) {
    // do nothing yet
    next();
  }

  validateAuthInfo(req, res, next) {
    if ((_.isUndefined(req.body.provider) || ("" === req.body.provider))) {
      return failWith(logger, res, 'Required Field req.body.provider not found', 400);
    }
    let authType = req.body.provider;
    if (KAKAO_AUTH_TYPE === authType) {
      if ((_.isUndefined(req.body.access_token) || ("" === req.body.access_token))) {
        return failWith(logger, res, 'Registering with KakaoTalk requires req.body.access_token', 400);
      } else {
        // param check passed
        return next();
      }
    } else if (EMAIL_AUTH_TYPE === authType) {
      if ((_.isUndefined(req.body.email) || ("" === req.body.email)) || (_.isUndefined(req.body.password) || ("" === req.body.password))) {
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
    // if ((_.isUndefined(req.body.nickname)) || ("" === req.body.nickname)) {
    //   return failWith(logger, res, 'Required Field req.body.nickname not found', 400);
    // }

    this.validateAuthInfo(req, res, next);
  }

  validateRateUser(req, res, next) {
    if ((_.isUndefined(req.body.rate)) || ("" === req.body.rate)) {
      return failWith(logger, res, 'Required Field req.body.rate not found', 400);
    }

    if (("up" !== req.body.rate) && ("down" !== req.body.rate)) {
      if (req.body.rate > 0 && req.body.rate < 5) {
      } else {
        return failWith(logger, res, `Invlid value ${req.body.rate} in req.body.rate`, 400);
      }
    }

    next();
  }

  async checkNicknameAvailability(req, res) {
    let nickname = req.query.nickname;
    if (_.isNull(nickname)) {
      return failWith(logger, res, 'req.query.nickname was not found', 400);
    }

    try {
      if (this.isNicknameAvailable(nickname)) {
        return succeedWith(logger, res, null, 200);
      } else {
        return failWith(logger, res, `nickname ${nickname} is in use`, 400);
      }
    } catch (e) {
      return failWith(logger, res, e.message, 400);
    }
  }

  async isNicknameAvailable(nickname) {
    let user = await this.userMgr.model.findOne({
      where: {
        nickname: nickname
      },
    });
    return _.isNull(user);
  }

};