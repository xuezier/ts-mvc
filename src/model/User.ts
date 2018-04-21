import * as Mongodb from 'mongodb';
import {Collection, Model} from 'mvc';

@Collection('test')
@Model()
export class User {
  _id: Mongodb.ObjectID;
  name: string;
  user: number;
}