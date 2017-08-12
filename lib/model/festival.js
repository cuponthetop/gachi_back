import * as _ from 'lodash';
import { DATE, STRING, INTEGER, UUID, UUIDV4, BLOB } from 'sequelize';

export const FESTIVAL_TABLE_NAME = 'festival';

export class FestivalManager {
  constructor(dataService) {
    this.dataService = dataService;
    this.festival = this.dataService.define(FESTIVAL_TABLE_NAME, {
      fid: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      title: { type: STRING, allowNull: false },
      starring: { type: STRING(512), allowNull: false },
      from: { type: DATE, allowNull: false },
      until: { type: DATE, allowNull: false },
      image: { type: STRING(512), allowNull: true, defaultValue: '' },
      detail: { type: STRING(1400), allowNull: true },
      location: { type: STRING, allowNull: true }
    }, {
        indexes: [
          { fields: ['title'] },
          { fields: ['from'] },
          { fields: ['until'] },
          { fields: ['detail'] },
          { fields: ['location'] },
        ],
        timestamps: false
      });
  }

  get model() { return this.festival; }
}