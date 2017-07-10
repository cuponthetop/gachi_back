import * as _ from 'lodash';

export class User {
  constructor(
    id,
    name,
  ) { };
};

export class UserManager {
  constructor(dataService) { }

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