import * as _ from 'lodash';
import { DATE, STRING, INTEGER, UUID, BLOB } from 'sequelize';

export const FESTIVAL_TABLE_NAME = 'festival';

export class FestivalManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.festival = this.dataService.define(FESTIVAL_TABLE_NAME, {
      fid: { type: UUID, primaryKey: true },
      title: { type: STRING, allowNull: false },
      from: { type: DATE, allowNull: false },
      until: { type: DATE, allowNull: false },
      image: { type: BLOB('medium'), allowNull: true },
      detail: { type: STRING(1000), allowNull: true },
      location: { type: STRING, allowNull: true }
    }, {
        indexes: [
          { fields: ['title'] },
          { fields: ['from'] },
          { fields: ['until'] },
          { fields: ['detail'] },
          { fields: ['location'] },
        ]
      });
  }

  get model() { return this.festival; }
}