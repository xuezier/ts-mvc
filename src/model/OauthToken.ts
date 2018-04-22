import * as Mongodb from 'mongodb';
import {Collection, Model} from 'mvc';

@Collection('oauth.tokens')
@Model()
export class OauthToken {
  _id: Mongodb.ObjectID;
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string;
  user: Mongodb.ObjectID;
  client: Mongodb.ObjectID;
  status: string
}