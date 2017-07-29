import * as _ from 'lodash';
import { FESTIVAL_TABLE_NAME } from './festival';
import { USER_TABLE_NAME } from './user';
import { DATE, STRING, INTEGER, TEXT, UUID, UUIDV4, ENUM } from 'sequelize';

export const LEADROOM_TABLE_NAME = 'leadroom';

export class LeadroomManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.leadroom = this.dataService.define(LEADROOM_TABLE_NAME, {
      leadroom_id: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      // status: { type: ENUM(['open', 'closed']), defaultValue: 'open' },
      max_follower: { type: INTEGER },
      lead_from: { type: DATE },
      lead_until: { type: DATE },
      age: { type: STRING },
      characteristic: { type: STRING },
      location: { type: STRING },
      detail: { type: STRING(1000) }
    }, {
        indexes: [
          { fields: ['age'] },
          { fields: ['lead_from'] },
          { fields: ['lead_until'] },
          { fields: ['detail'] },
          { fields: ['location'] },
          { fields: ['characteristic'] },
        ]
      });

    // retrieve model
    let festival = this.dataService.model(FESTIVAL_TABLE_NAME);
    let user = this.dataService.model(USER_TABLE_NAME);

    // has one festival
    festival.hasOne(this.leadroom, { as: 'festival', foreignKey: 'fid' });
    // has one user as leadroom
    user.hasOne(this.leadroom, { as: 'leader', foreignKey: 'leader_id' });
    // has many user as follower
  }

  get model() { return this.leadroom; }
}