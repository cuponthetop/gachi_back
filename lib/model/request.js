import * as _ from 'lodash';
import { FESTIVAL_TABLE_NAME } from './festival';
import { USER_TABLE_NAME } from './user';
import { LEADROOM_TABLE_NAME } from './leadroom';
import { ENUM, UUID, UUIDV4 } from 'sequelize';

export const REQUEST_TABLE_NAME = 'request';

export class RequestManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.request = this.dataService.define(REQUEST_TABLE_NAME, {
      rid: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      status: { type: ENUM(['pending', 'accepted', 'rejected', 'canceled']) }
    }, {
        indexes: [
          { fields: ['status'] }
        ]
      });

    // retrieve model
    let leadroom = this.dataService.model(LEADROOM_TABLE_NAME);
    let user = this.dataService.model(USER_TABLE_NAME);

    // has one lead
    leadroom.hasOne(this.request, { as: 'leadroom', foreignKey: 'leadroom_id' });
    // has one user as request_sender
    user.hasOne(this.request, { as: 'requester', foreignKey: 'requester_id' });
  }

  get model() { return this.request; }
}