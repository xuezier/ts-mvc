import * as Mongodb from 'mongodb';

import {Service, Redis} from 'mvc';
import { OauthToken, User } from '../model';

@Service()
@Redis({name: 'sms.code', prefix: 'sms.code'})
export class SmsRedisService {

  public async bindCodeWithMobile(mobile: string, code: string): string {
    return await this.client.setex(mobile, 60 * 5, code);
  }

  public async getCodeByMobile(mobile: string): string {
    return await this.client.get(mobile);
  }

  public async incrCodeRequest(mobile) {
    const key = `.request${mobile}`;

    const now = new Date;
    const hours = 23 - now.getHours();
    const munites = 59 - now.getMinutes();
    const seconds = 60 - now.getSeconds();
    const ttl = seconds + munites * 60 + hours * 60 * 60;

    await this.client.incr(key);
    await this.client.expire(key, ttl);
  }

  public async getCodeRequestLimit(mobile): number {
    const key = `.request${mobile}`;

    const limit: number = await this.client.get(key);

    return limit ? limit : 0;
  }
}

@Service()
@Redis({name: 'oauth.token', prefix: 'oauth.token'})
export class OauthAccessTokenRedisService {

  public async setAccessToken(token: OauthToken) {
    token.user = token.user.toHexString();
    token.client = token.client.toHexString();

    delete token._id;

    await this.client.hmset(token.accessToken, token);
    return await this.client.pexpireat(token.accessToken, +token.accessTokenExpiresAt);
  }

  public async getAccessToken(key: string) {
    const token: OauthToken = await this.client.hmget(key);
    if(!token) return null;

    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
    token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
    return token;
  }

  public async setUser(user: User) {
    user._id = user._id.toHexString();
    await this.client.hmset(`.user${user._id}`, user);
    user._id = Mongodb.ObjectID(user._id);
  }

  public async getUser(key: string) {
    const user: User = await this.client.hmget(`.user${key}`);
    if(!user) return null;

    user._id = Mongodb.ObjectID(user._id);
    return user;
  }
}
