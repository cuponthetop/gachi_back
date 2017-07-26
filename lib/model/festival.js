import * as _ from 'lodash';
import { STRING, INTEGER, UUIDV4 } from 'sequelize';

const FESTIVAL_TABLE_NAME = 'festival';

export class FestivalManager {
  constructor(dataService) {
    this.festival = this.dataService.define(FESTIVAL_TABLE_NAME, {

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