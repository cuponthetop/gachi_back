import * as _ from 'lodash';
import { LEADROOM_TABLE_NAME } from './leadroom';
import { USER_TABLE_NAME } from './user';
import { UUID } from 'sequelize';

export const LEADROOM_MEMBER_TABLE_NAME = 'leadroom-member';

export class LeadroomMemberManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.leadroomMember = this.dataService.define(LEADROOM_MEMBER_TABLE_NAME, {
      leadroom_id: { type: UUID },
      member: { type: UUID }
    });

    // retrieve model
    let leadroom = this.dataService.model(LEADROOM_TABLE_NAME);
    let user = this.dataService.model(USER_TABLE_NAME);

    // has one leadroom
    leadroom.belongsToMany(user, {
      through: {
        model: this.leadroomMember,
        unique: false
      },
      foreignKey: 'leadroom_id',
      constraints: false
    });
    user.belongsToMany(leadroom, {
      through: {
        model: this.leadroomMember,
        unique: false
      },
      foreignKey: 'member',
      constraints: false
    });
  }

  get model() { return this.leadroomMember; }

}