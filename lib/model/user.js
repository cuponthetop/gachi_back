import * as _ from 'lodash';
import { STRING, INTEGER, UUID, DECIMAL } from 'sequelize';

const USER_TABLE_NAME = 'user';

export class UserManager {

  constructor(dataService) {
    this.dataService = dataService;
    this.user = this.dataService.define(USER_TABLE_NAME, {
      uid: { type: UUID, primaryKey: true },
      fbid: { type: STRING, allowNull: false },
      profile_image: { type: STRING, allowNull: true, defaultValue: null },
      nickname: { type: STRING(32), allowNull: false, unique: true },
      age: { type: INTEGER, allowNull: true, defaultValue: null },
      gender: { type: STRING(8), allowNull: true, defaultValue: null },
      reliability: { type: DECIMAL, allowNull: false, defaultValue: 0 },
      region: { type: STRING(32), allowNull: true, defaultValue: null },
    }, {
        indexes: [
          { unique: true, fields: ['fbid'] }
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