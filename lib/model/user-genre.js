import * as _ from 'lodash';
import { USER_TABLE_NAME } from './user';
import { GENRE_TABLE_NAME } from './genre';
import { STRING, UUID } from 'sequelize';

const USER_GENRE_TABLE_NAME = 'user-genre';

export class FestivalGenreManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.userGenre = this.dataService.define(USER_GENRE_TABLE_NAME, {
      uid: { type: UUID },
      genre: { type: STRING }
    });

    // get definition
    let user = this.dataService.model(USER_TABLE_NAME);
    let genre = this.dataService.model(GENRE_TABLE_NAME);

    // association
    user.belongsToMany(genre, {
      through: {
        model: this.userGenre,
        unique: false
      },
      foreignKey: 'uid',
      constraints: false
    });

    genre.belongsToMany(user, {
      through: {
        model: this.userGenre,
        unique: false
      },
      foreignKey: 'genre',
      constraints: false
    });
  }
}