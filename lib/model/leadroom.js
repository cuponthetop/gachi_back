import * as _ from 'lodash';
import { FESTIVAL_TABLE_NAME } from './festival';
import { USER_TABLE_NAME } from './user';
import { DATE, STRING, INTEGER, TEXT, UUID } from 'sequelize';


const LEADROOM_TABLE_NAME = 'leadroom';

export class LeadroomManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.leadroom = this.dataService.define(LEADROOM_TABLE_NAME, {
      leadroom_id: { type: UUID, primaryKey: true },
      max_follower: { type: INTEGER },
      lead_from: { type: DATE },
      lead_until: { type: DATE },
      age: { type: STRING },
      characteristic: { type: STRING },
      location: { type: STRING },
      detail: { type: TEXT }
    }, {
        indexes: [
          { fields: ['age', 'lead_from', 'lead_until', 'detail', 'location', 'characteristic'] }
        ]
      });

    // retrieve model
    let festival = this.dataService.model(FESTIVAL_TABLE_NAME);
    let user = this.dataService.model(USER_TABLE_NAME);

    // has one festival
    this.request.hasOne(festival, { as: 'festival', foreignKey: 'fid'});
    // has one user as leadroom
    this.request.hasOne(user, { as: 'leader', foreignKey: 'leader_id'});
    // has many user as follower
  }

}