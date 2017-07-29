import * as _ from 'lodash';
import { STRING, INTEGER, UUID, UUIDV4, DECIMAL, BLOB, ENUM } from 'sequelize';

export const USER_TABLE_NAME = 'user';

export class UserManager {

  constructor(dataService) {
    this.dataService = dataService;
    this.user = this.dataService.define(USER_TABLE_NAME, {
      uid: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      fbid: { type: STRING, allowNull: false },
      profile_image: {
        type: BLOB('medium'), allowNull: true, defaultValue: null,
        get() {
          return this.getDataValue('image').toString('base64');
        }
      },
      nickname: { type: STRING(32), allowNull: false, unique: true },
      age: { type: INTEGER, allowNull: true, defaultValue: null },
      gender: { type: ENUM(['male', 'female']), allowNull: true, defaultValue: null },
      reliability: { type: DECIMAL, allowNull: false, defaultValue: 0 },
      location: { type: STRING(32), allowNull: true, defaultValue: null },
      init_step: { type: INTEGER, defaultValue: 0 }
    }, {
        indexes: [
          { unique: true, fields: ['fbid'] }
        ]
      });
  }

  get model() { return this.user; }

}