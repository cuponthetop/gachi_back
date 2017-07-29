import { Festival as FestivalModel, FestivalManager } from '../model/festival';
import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';
import { retrieveImage } from '../util/retrieve-image';

export class FestivalController {

  constructor(
    festivalMgr,
    festivalGenreMgr
  ) {
    this.festivalMgr = festivalMgr;
    this.festivalGenreMgr = festivalGenreMgr;
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
    let imageURL = _.get(req.body, 'image', null);
    let detail = _.get(req.body, 'detail', '');
    let location = _.get(req.body, 'location', '');
    let genre = _.get(req.body, 'genre', '');

    // image need to be url, server will retrieve and save it
    let image = null;
    if (false === _.isNull(image)) {
      // retrive image
      let binaryImage = await retrieveImage(imageURL);
      image = binaryImage;
    }

    try {
      // create festival instance
      let newFestival = await this.festivalMgr.model.create({
        title,
        from,
        until,
        image,
        detail,
        location
      });

      succeedWith(logger, res, { fid: newFestival.fid }, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getFestivalList(req, res) {
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
        }
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
                }
              ]
            }, {
              until: {
                $gt: new Date()
              }
            }
          ]
        }
      });
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getFestival(req, res) {
  }

};