import * as Mongodb from 'mongodb';

export interface IMongoDb extends Mongodb.Db {
  name: string;
}