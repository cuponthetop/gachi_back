import * as _ from 'lodash';
import { STRING } from 'sequelize';

export const GENRE_TABLE_NAME = 'genre';

export class GenreManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.genre = this.dataService.define(GENRE_TABLE_NAME, {
      genre: { type: STRING, primaryKey: true }
    });
  }
}