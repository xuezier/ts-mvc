import * as Mongodb from 'mongodb';

import {Model, Collection} from 'mvc';

@Collection('sms.code')
@Model()
export class SmsCode {
  _id: Mongodb.ObjectID;
  code: string;
  mobile: string;
  create_at: Date;
  use: string;
  msg: string;
  fee: number;
  unit: string;
  sid: number;
}