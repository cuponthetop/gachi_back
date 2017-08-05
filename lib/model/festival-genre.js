import * as _ from 'lodash';
import { FESTIVAL_TABLE_NAME } from './festival';
import { GENRE_TABLE_NAME } from './genre';
import { STRING, UUID, INTEGER } from 'sequelize';

export const FESTIVAL_GENRE_TABLE_NAME = 'festival-genre';

export class FestivalGenreManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.festivalGenre = this.dataService.define(FESTIVAL_GENRE_TABLE_NAME, {
      fgid: { type: INTEGER, primaryKey: true, autoIncrement: true },
      fid: { type: UUID },
      genre: { type: STRING }
    }, {
        timestamps: false
      });

    // get definition
    let festival = this.dataService.model(FESTIVAL_TABLE_NAME);
    let genre = this.dataService.model(GENRE_TABLE_NAME);

    // association
    this.festivalAssociation = festival.belongsToMany(genre, {
      through: {
        model: this.festivalGenre,
        unique: false
      },
      foreignKey: 'fid'
    });

    genre.belongsToMany(festival, {
      through: {
        model: this.festivalGenre,
        unique: false
      },
      foreignKey: 'genre'
    });
  }

  get association() { return this.festivalAssociation; }
  get model() { return this.festivalGenre; }
  get genre() { return this.dataService.model(GENRE_TABLE_NAME); }
}