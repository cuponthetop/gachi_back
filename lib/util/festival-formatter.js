import { includeMembers } from './leadroom-formatter';
import { sequelizeAsyncmap } from './common-formatter';
import * as _ from 'lodash';

export async function includeLeadrooms(festival, jsoned) {
  let leadrooms = await festival.getLeadrooms();
  _.set(jsoned, 'leadrooms', _.map(leadrooms, async function (leadroom) {
    return { leadroom: await includeMembers(leadroom, leadroom.toJSON()) };
  }));
  return jsoned;
}

export async function includeGenres(festival, jsoned) {
  let genres = await festival.getGenres();
  _.set(jsoned, 'genres', _.map(genres, function (genre) { return { genre: genre.genre }; }));
  return jsoned;
}

export let includeGenresToResults = sequelizeAsyncmap.bind(null, includeGenres);
