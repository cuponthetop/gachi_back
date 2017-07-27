import * as _ from 'lodash';
import { FESTIVAL_TABLE_NAME } from './festival';
import { GENRE_TABLE_NAME } from './genre';
import { STRING, UUID } from 'sequelize';

export const FESTIVAL_GENRE_TABLE_NAME = 'festival-genre';

export class FestivalGenreManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.festivalGenre = this.dataService.define(FESTIVAL_GENRE_TABLE_NAME, {
      fid: { type: UUID },
      genre: { type: STRING }
    });

    // get definition
    let festival = this.dataService.model(FESTIVAL_TABLE_NAME);
    let genre = this.dataService.model(GENRE_TABLE_NAME);

    // association
    festival.belongsToMany(genre, {
      through: {
        model: this.festivalGenre,
        unique: false
      },
      foreignKey: 'fid',
      constraints: false
    });

    genre.belongsToMany(festival, {
      through: {
        model: this.festivalGenre,
        unique: false
      },
      foreignKey: 'genre',
      constraints: false
    });
  }
}