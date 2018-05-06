import * as Mongodb from 'mongodb';
import {Collection, Model} from 'mvc';

export enum OauthTokenStatus {
  expired = 'EXPIRED',
  active = 'ACTIVE'
}

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
  status: OauthTokenStatus;
}