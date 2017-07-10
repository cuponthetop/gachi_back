import * as _ from 'lodash';

export class User {
  constructor(
    public id,
    public name,
  ) { };
};

export class UserManager {
  constructor(private dataService) { }

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