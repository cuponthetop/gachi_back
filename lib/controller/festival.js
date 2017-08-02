import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';
import { retrieveImage } from '../util/retrieve-image';
import { extname } from 'path';

export class FestivalController {

  constructor(
    festivalMgr,
    leadroomMgr,
    leadroomMemberMgr,
    festivalGenreMgr,
    storageManager
  ) {
    this.festivalMgr = festivalMgr;
    this.leadroomMgr = leadroomMgr;
    this.leadroomMemberMgr = leadroomMemberMgr;
    this.festivalGenreMgr = festivalGenreMgr;
    this.storageManager = storageManager;
  }

  async loadTargetFestivalInfo(req, res, next) {
    let festivalID = req.params["fid"];

    let festivalInfo = await this.festivalMgr.model.findById(festivalID);

    if (_.isNull(festivalInfo)) {
      logger.info(`loadTargetFestival - festivalID: ${festivalID} not found`);
      failWith(logger, res, 'Target Festival Not Found', 404);
    } else {
      _.set(req, 'info.targetFestival', festivalInfo);

      next();
    }
  }

  async createFestival(req, res) {
    // validate body
    let title = _.get(req.body, 'title', '');
    let from = _.get(req.body, 'from', Date.now());
    let until = _.get(req.body, 'until', Date.now());
    let imageURL = _.get(req.body, 'imageURL', null);
    let detail = _.get(req.body, 'detail', '');
    let location = _.get(req.body, 'location', '');
    let genre = _.get(req.body, 'genre', '');

    let newFestival = null;
    try {
      // create festival instance
      newFestival = await this.festivalMgr.model.create({
        title,
        from,
        until,
        detail,
        location
      });
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    if (_.isNull(newFestival)) {
      return failWith(logger, res, 'failed to create new festival', 500);
    }

    let image = '';

    try {
      // image need to be url, server will retrieve and save it
      if (false === _.isNull(imageURL)) {
        // retrive image
        let ext = extname(imageURL);
        let binaryImage = await retrieveImage(imageURL);
        let url = await this.storageManager.uploadBinaryImage(binaryImage, newFestival.fid + ext);
        image = url;
      }
    } catch (e) {
      // TODO:: do not ignore exception throw from gcloud storage
      logger.log(e.message);
    }

    try {
      newFestival.set({ image });
      await newFestival.save();
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }

    try {
      await newFestival.addGenres(genre);
      succeedWith(logger, res, { fid: newFestival.fid }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getFestivalList(req, res) {
    // TODO: should order data
    // TODO: fix crashing & unexpected eod
    let type = _.get(req.query, 'type', '');

    try {
      let result = await this.festivalMgr.model.findAll({
        where: {
          $and: [
            {
              until: {
                $gt: new Date()
              }
            }
          ]
        },
        include: [
          {
            model: this.leadroomMgr.model
          },
          {
            model: this.festivalGenreMgr.genre,
            through: { attributes: [] }
          }]
      });
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async searchFestival(req, res) {
    let searchTerm = _.get(req.query, 'term', '');

    try {
      let result = await this.festivalMgr.model.findAll({
        where: {
          $and: [
            {
              $or: [
                {
                  title: { $like: `%${searchTerm}%` }
                },
                {
                  detail: { $like: `%${searchTerm}%` }
                },
                {
                  location: { $like: `%${searchTerm}%` }
                },
                {
                  '$genres.genre$': { $like: `%${searchTerm}%` }
                }
              ]
            }, {
              until: {
                $gt: new Date()
              }
            }
          ]
        },
        include: [
          {
            model: this.leadroomMgr.model
          },
          {
            model: this.festivalGenreMgr.genre,
            through: { attributes: [] }
          }]
      });
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getFestival(req, res) {
  }

};