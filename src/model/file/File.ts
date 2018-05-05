import * as Mongodb from 'mongodb';
import * as SchemaObject from 'schema-object';

import {Model, Collection} from 'mvc';
import { ModelSchema } from '../../decorator/ModelSchema';

export const FileSchema = new SchemaObject({
  name: String,
  size: Number,
  type: String,
  extension: String,
  cdn: new SchemaObject({
    hash: String,
    key: String,
    server_url: String
  }),
  create_at: {type: Date, default: () => new Date}
});

@Collection('file')
@Model()
@ModelSchema(FileSchema)
export class File {
  _id: Mongodb.ObjectID;
  name: string;
  size: string;
  type: string;
  extension: string;
  cdn: {
    hash: string;
    key: string;
    server_url: string;
  };
  create_at: Date;
}