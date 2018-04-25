import * as Mongodb from 'mongodb';
import * as SchemaObject from 'schema-object';

import {Model, Collection} from 'mvc';

@Collection('goods')
@Model()
export class Goods {
  _id: Mongodb.ObjectID;
  name: string;
  types: Mongodb.ObjectID[];
  tags: Mongodb.ObjectID[];
}