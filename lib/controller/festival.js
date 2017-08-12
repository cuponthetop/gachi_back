import * as _ from 'lodash';
import { succeedWith, failWith } from '../util/response';
import { pseudoRandomBytes } from 'crypto';
import { logger } from '../util/logger';
import { retrieveImage } from '../util/retrieve-image';
import { extname } from 'path';

const limitSize = 15;
const validTypes = ['default', 'going', 'recent'];

async function addGenresToResults(result) {
  let resultsPromises = _.map(result, async function (el) {
    let genres = await el.getGenres();
    let json = el.toJSON();
    _.set(json, 'genres', _.map(genres, function (genre) { return { genre: genre.genre }; }));
    return json;
  });

  return await Promise.all(resultsPromises);
}

function filterAndOrderResults(result, order, limit, offset) {
  return _.slice(_.orderBy(result, order.attributes, order.methods), offset, offset + limit + 1);
}

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

  getOrderFromType(type) {
    switch (type) {
      case 'going': {
        return {
          attributes: [],
          methods: []
        };
        break;
      }
      case 'default':
      case 'recent': {
        return {
          attributes: ['from'],
          methods: ['DESC']
        };
        break;
      }
    }
  }

  async getFestivalList(req, res) {
    // TODO: should order data
    // TODO: ADD leadroom count + leadroom member count
    let type = _.get(req.query, 'type', 'default');
    let page = _.get(req.query, 'page', 1);
    let limit = limitSize;
    let offset = (page - 1) * limitSize;
    let order = this.getOrderFromType(type);

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
          }],
      });

      result = filterAndOrderResults(result, order, limit, offset);
      result = await addGenresToResults(result);
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async searchFestival(req, res) {
    // TODO: check if we can find by second genre
    let searchTerm = _.get(req.query, 'term', '');
    let page = _.get(req.query, 'page', 0);
    let limit = limitSize;
    let offset = (page - 1) * limitSize;
    let order = this.getOrderFromType('recent');

    try {
      // TODO: move this query template into model (at least include and limit etc...) make some generalization
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
          }],
      });

      result = filterAndOrderResults(result, order, limit, offset);
      result = await addGenresToResults(result);
      succeedWith(logger, res, result, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  async getFestival(req, res) {
    let festival = _.get(req.info, 'targetFestival', null);

    try {
      // TODO: ADD count query
      let leadroom = festival.getLeadrooms();

      festival.leadrooms = leadroom;

      return succeedWith(logger, res, festival, 200);
    } catch (e) {
      return failWith(logger, res, e.message, 500);
    }
  }

  validatePagination(req, res, next) {
    let page = _.get(req.query, 'page', 0);
    if (_.isInteger(page)) {
      return failWith(logger, res, `page number should be integer`, 400);
    } else if (page > 99 || page < 0) {
      return failWith(logger, res, `LOL, are you serious?`, 400);
    } else {
      return next();
    }

  }

  validateSearch(req, res, next) {
    let searchTerm = _.get(req.query, 'term', null);

    if (_.isNull(searchTerm)) {
      return failWith(logger, res, `give me some search term`, 400);
    } else {
      return next();
    }
  }

  validateFestivalList(req, res, next) {
    let type = _.get(req.query, 'type', null);

    if (_.isNull(type)) {
      return failWith(logger, res, `give me some list type`, 400);
    } else if (validTypes.indexOf(type) === -1) {
      return failWith(logger, res, `valid list types are ${validTypes}`, 400);
    } else {
      return next();
    }
  }

};