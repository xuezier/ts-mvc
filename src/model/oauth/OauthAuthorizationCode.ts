import * as Mongodb from 'mongodb';
import {Collection, Model} from 'mvc';

export enum OauthAuthorizationCodeStatus {
  expired = 'EXPIRED',
  active = 'ACTIVE',
}

@Collection('oauth.authorization_code')
@Model()
export class OauthAuthorizationCode {
  _id: Mongodb.ObjectID;
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope: string;
  client: Mongodb.ObjectID;
  user: Mongodb.ObjectID;
  status: OauthAuthorizationCodeStatus;
}