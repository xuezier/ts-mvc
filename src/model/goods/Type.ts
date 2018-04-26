import * as Mongodb from 'mongodb';
import * as SchemaObject from 'schema-object';

import {Model, Collection} from 'mvc';
import { ModelSchema } from '../../decorator/ModelSchema';

export const GoodsTypeSchema = new SchemaObject({
  name: {type: String, required: true, minLength: 1},
  description: {type: String, default: ''},
  status: {type: String, enum: ['active', 'disabled'], default: 'active'},
  parent: {type: Object, preserveNull: true},
  create_at: {type: Date, default: () => new Date}
});

@Collection('goods.types')
@Model()
@ModelSchema(GoodsTypeSchema)
export class GoodsType {
  _id: Mongodb.ObjectID;
  name: string;
  description: string;
  parent: Mongodb.ObjectID;
  status: string;
  create_at: Date;
}