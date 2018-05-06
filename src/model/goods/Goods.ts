import * as Mongodb from 'mongodb';
import * as SchemaObject from 'schema-object';

import {Model, Collection} from 'mvc';

@Collection('goods')
@Model()
export class GoodsModel {
  _id: Mongodb.ObjectID;
  name: string;
  type: Mongodb.ObjectID;
  tags: Mongodb.ObjectID[];
  description: Mongodb.ObjectID;
  thumb_images: Mongodb.ObjectID[];
  combination: Mongodb.ObjectID[];
  stock: number;
}