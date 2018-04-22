import * as Mongodb from 'mongodb';
import {Collection, Model} from 'mvc';

@Collection('user')
@Model()
export class User {
  _id: Mongodb.ObjectID;
  email: string;
  email_verified: boolean;
  mobile: string;
  mobile_verified: boolean;
  name: string;
  description: string;
  avatar: string;
  password: {
    hash: string;
    salt: string;
  };
  birthdate: Date;
  address: {
      country: string;
      province: string;
      city: string;
      address: string;
      district: string;
  };
  sex: string;
  locale: string;
  timezone: string;
  activiated: boolean;
  create_at: Date;
  last_login: {
    type: string;
    time: Date;
  };
}