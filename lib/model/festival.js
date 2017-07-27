import * as _ from 'lodash';
import { DATE, STRING, INTEGER, UUID, BLOB, TEXT } from 'sequelize';

const FESTIVAL_TABLE_NAME = 'festival';

export class FestivalManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.festival = this.dataService.define(FESTIVAL_TABLE_NAME, {
      fid: { type: UUID, primaryKey: true },
      title: { type: STRING, allowNull: false },
      from: { type: DATE, allowNull: false },
      until: { type: DATE, allowNull: false },
      image: { type: BLOB('medium'), allowNull: true },
      detail: { type: TEXT, allowNull: true },
      location: { type: STRING, allowNull: true }
    }, {
        indexes: [
          { fields: ['title', 'from', 'until', 'detail', 'location'] }
        ]
      });
  }

  async get(userID) {

    try {
      let userInfo = await this.dataService.find('users', {
        id: userID
      });

      return projInfo;
    } catch (e) {
      return null;
    }
  }

  async save(datum) {

  }

  async delete(datum) {

  }
}