import * as Crypto from 'crypto';
import * as Path from 'path';
import * as Http from 'http';
import * as QueryString from 'querystring';

import * as Request from 'request';

import {Vendor, Inject} from 'mvc';
import { WechatConfigModel, WechatAccessTokenModel, WechatUserModel } from './model/WechatModel';
import { DefinedError } from '../model/DefinedError';
import { User, OauthClient } from '../model';
import { OauthAuthorizationCode, OauthAuthorizationCodeStatus } from '../model/oauth/OauthAuthorizationCode';

@Vendor()
export class Wechat {
  @Inject()
  private config: WechatConfigModel;

  @Inject()
  private accessToken: WechatAccessTokenModel;

  @Inject()
  private wechatUser: WechatUserModel;

  @Inject()
  private authorizationCode: OauthAuthorizationCode;

  @Inject()
  private oauthClient: OauthClient;

  /**
   * verify wechat service token signature
   *
   * @param {string} signature
   * @param {string} timestamp
   * @param {string} nonce
   * @returns {boolean}
   * @memberof Wechat
   */
  public checkSignature(signature: string, timestamp: string, nonce: string): boolean {
    const signArr = [this.config.token, timestamp, nonce].sort();
    const signString = signArr.join('');

    const tempSignature = Crypto.createHash('sha1').update(signString).digest('hex');

    return tempSignature === signature;
  }

  /**
   * get user access token by authorization code
   *
   * @param {string} code
   * @returns {Promise<WechatAccessTokenModel>}
   * @memberof Wechat
   */
  public async getAccessTokenByCode(code: string): Promise<WechatAccessTokenModel> {

    const url = this.config.ACCESSTOKENURL + code;

    const token: WechatAccessTokenModel = await this._request(url, 'post');

    if (token.errcode) {
      throw new DefinedError(400, token.errmsg);
    }

    token.code = code;
    await this.accessToken.getCollection().insertOne(token);

    return token;
  }

  /**
   * get wechat user base info
   *
   * @param {string} access_token
   * @param {string} openid
   * @returns {Promise<WechatUserModel>}
   * @memberof Wechat
   */
  public async getWechatUserInfo(access_token: string, openid: string): Promise<WechatUserModel> {
    const url = this.config.WECHATUSERINFOURL + QueryString.stringify({access_token, openid});

    const info: WechatUserModel = await this._request(url, 'get');

    if(info.errcode) {
      throw new DefinedError(400, token.errmsg);
    }

    return info;
  }

  /**
   * save wechat base user info
   *
   * @param {WechatUserModel} user
   * @returns
   * @memberof Wechat
   */
  public async saveWechatUser(user: WechatUserModel) {
    const result = await this.wechatUser.getCollection().findOneAndUpdate({openid: user.openid}, {$set: user}, {returnOriginal: false});
    return result.value;
  }

  public async updateWechatUser(user: WechatUserModel) {
    await this.wechatUser.getCollection().findOneAndUpdate()
  }

  private async _request(url: string, method: string) {
    return new Promise((resolve, reject) => {
      Request[method](url, (err: Error, res: Http.ImcomingMessage, body: string) => {
        if(err) {
          return reject(err);
        }

        resolve(JSON.parse(body));
      });
    });
  }

  /**
   * manual genetate oauth authorization code by wechat code
   *
   * @param {string} code
   * @param {User} user
   * @memberof Wechat
   */
  public async createAuthorizationCode(code: string, user: User) {
    let authorizationCode = new OauthAuthorizationCode();
    authorizationCode.authorizationCode = code;
    authorizationCode.user = user._id;
    const client: OauthClient = await this.oauthClient.getCollection().findOne({client_id: this.config.oauth_client});

    authorizationCode.client = client._id;
    console.log(client)
    authorizationCode.redirectUri = client.redirectUris[0];

    authorizationCode.scope = 'read';
    authorizationCode.status = OauthAuthorizationCodeStatus.active;
    authorizationCode.expiresAt = new Date(+new Date + (1000 * 60 *10));

    await this.authorizationCode.getCollection().insertOne(authorizationCode);
  }

  /**
   * find access token by authorization code
   *
   * @param {string} code
   * @returns {Promise<WechatAccessTokenModel>}
   * @memberof Wechat
   */
  public async findAccessTokenByCode(code: string): Promise<WechatAccessTokenModel> {
    return await this.accessToken.getCollection().findOne({code});
  }
}