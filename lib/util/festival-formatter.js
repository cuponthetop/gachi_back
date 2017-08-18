import { includeAllForLeadroom } from './leadroom-formatter';
import { sequelizeAsyncmap } from './common-formatter';
import * as _ from 'lodash';

export async function includeLeadrooms(festival, jsoned) {
  let leadrooms = await festival.getLeadroom();
  _.set(jsoned, 'leadrooms', _.map(leadrooms, async function (leadroom) {
    return { leadroom: await includeAllForLeadroom(leadroom, leadroom.toJSON()) };
  }));

  _.set(jsoned, 'going', _.sumBy(jsoned.leadrooms, 'numMembers'));
  return jsoned;
}

export async function includeGenres(festival, jsoned) {
  let genres = await festival.getGenres();
  _.set(jsoned, 'genres', _.map(genres, function (genre) { return { genre: genre.genre }; }));
  return jsoned;
}

export async function includeAllForFestival(festival, jsoned) {
  let ret = await includeGenres(festival, jsoned);
  ret = await includeLeadrooms(festival, ret);

  ret = _.omit(ret, []);

  return ret;
}

export let includeGenresToResults = sequelizeAsyncmap.bind(null, includeGenres);

export let includeAllForFestivalToResults = sequelizeAsyncmap.bind(null, includeAllForFestival);
