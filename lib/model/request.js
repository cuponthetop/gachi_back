import * as _ from 'lodash';
import { FESTIVAL_TABLE_NAME } from './festival';
import { USER_TABLE_NAME } from './user';
import { LEADROOM_TABLE_NAME } from './leadroom';
import { ENUM } from 'sequelize';


const REQUEST_TABLE_NAME = 'request';

export class RequestManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.request = this.dataService.define(REQUEST_TABLE_NAME, {
      status: { type: ENUM(['pending', 'accepted', 'rejected']) }
    }, {
        indexes: [
          { fields: ['status'] }
        ]
      });

    // retrieve model
    let leadroom = this.dataService.model(LEADROOM_TABLE_NAME);
    let user = this.dataService.model(USER_TABLE_NAME);

    // has one lead
    this.request.hasOne(leadroom, { as: 'leadroom', foreignKey: 'leadroom_id'});
    // has one user as request_sender
    this.request.hasOne(user, { as: 'requester', foreignKey: 'requester_id'});
  }
}