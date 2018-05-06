import {MongoContainer, Inject, Model, Controller} from 'mvc';

import {User, OauthClient, OauthToken, OauthTokenStatus} from '../model';

import * as Util from '../utils/util';
import { OauthAccessTokenRedisService } from '../services/RedisService';
import { OauthAuthorizationCode, OauthAuthorizationCodeStatus } from '../model/oauth/OauthAuthorizationCode';

@Controller()
export class OauthModel {
  @Inject()
  private redis = new OauthAccessTokenRedisService;

  /**
   * Invoked to generate a new access token.
   * @param {Object} client
   * @param {Object} user
   * @param {String} scope
   * @param {Function} callback
   */
  // public async generateAccessToken(client: object, user: object, scope: string) {

  // }
  /**
   * Invoked to generate a new refresh token.
   * @param {Object} client
   * @param {Object} user
   * @param {String} scope
   * @param {Function} callback
   */
  // public async generateRefreshToken(client: object, user: object, scope: string) {

  // }

  /**
   * Invoked to generate a new authorization code.
   * @param {OauthClient} client
   * @param {User} user
   * @param {string} scope
   * @memberof OauthModel
   */
  // public async generateAuthorizationCode(client: OauthClient, user: User, scope: string): string {

  // }

  /**
   * Invoked to retrieve an existing authorization code previously saved through
   *
   * @param {string} authorizationCode
   * @memberof OauthModel
   */
  public async getAuthorizationCode(authorizationCode: string): OauthAuthorizationCode {
    const db = MongoContainer.getDB();

    let code: OauthAuthorizationCode = await db.oauth.authorization_code.findOne({authorizationCode: authorizationCode});

    if((!code) || (code.status === OauthAuthorizationCodeStatus.expired)) {
      throw new Error('invalid_authorizationCode');
    }

    if(code.expiresAt < new Date) {
      throw new Error('invalid_authorizationCode_expire');
    }

    const user = await db.user.findOne({_id: code.user});
    delete user.password;
    const client = await db.oauth.clients.findOne({_id: code.client});

    code.user = user;
    code.client = client;

    return code;
  }

  /**
   * Invoked to save an authorization code.
   *
   * @param {OauthAuthorizationCode} code
   * @param {OauthClient} client
   * @param {User} user
   * @returns {OauthAuthorizationCode}
   * @memberof OauthModel
   */
  public async saveAuthorizationCode(code: OauthAuthorizationCode, client: OauthClient, user: User): OauthAuthorizationCode {
    const db = MongoContainer.getDB();

    code.user = user._id;
    code.client = client._id;
    code.status = OauthAuthorizationCodeStatus.active;
    await db.oauth.authorization_code.insertOne(code);

    return code;
  }

  /**
   * Invoked to revoke an authorization code.
   *
   * @param {OauthAuthorizationCode} code
   * @returns {boolean}
   * @memberof OauthModel
   */
  public async revokeAuthorizationCode(code: OauthAuthorizationCode): boolean {
    const db = MongoContainer.getDB();

    await db.oauth.authorization_code.findOneAndUpdate({_id: code._id}, {$set: {status: OauthAuthorizationCodeStatus.expired}});

    return true;
  }

  /**
   * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
   * @param {String} refreshToken
   */
  public async getRefreshToken(refreshToken: string) {
    const db = MongoContainer.getDB();

    const token: OauthToken = await db.oauth.tokens.findOne({refreshToken});

    if ((!token) || (token.status === OauthTokenStatus.expired) ) {
      throw new Error('invalid_refreshToken');
    }

    if (token.refreshTokenExpiresAt < new Date) {
      throw new Error('invalid_refreshToken_expire');
    }

    const user = await db.user.findOne({_id: token.user});
    const client = await db.oauth.clients.findOne({_id: token.client});

    token.user = user;
    token.client = client;

    return token;
  }
  /**
   * nvoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
   * @param {String} clientId
   * @param {String} clientSecret
   * @param {Function} callback
   */
  public async getClient(clientId: string, clientSecret: string) {
    const db = MongoContainer.getDB();
    const client: OauthClient = await db.oauth.clients.findOne({client_id: clientId});
    if (!client) return null;
    if (client.client_secret && (clientSecret !== client.client_secret)) {
      throw new Error('invalid_clientSecret');
    }

    return client;
  }
  /**
   * Invoked to retrieve a user using a username/password combination.
   * @param {String} username
   * @param {String} password
   * @param {Function} callback
   */
  public async getUser(username: string, password: string) {
    const db = MongoContainer.getDB();

    const query = {};

    if (Util.testEmail(username)) {
      query['email'] = username;
    } else if (Util.testMobile(username)) {
      query['mobile'] = username;
    } else {
      query['username'] = username;
    }

    const user: User = await db.user.findOne(query);

    if (!user) return null;

    const pass = user.password;

    const hash = Util.md5(password + pass.salt);

    if (!(hash === pass.hash)) {
      throw new Error('invalid_password');
    }

    delete user.password;
    return user;
  }
  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   * @param {Object} token
   * @param {Object} client
   * @param {Object} user
   */
  public async saveToken(token: OauthToken, client: OauthClient, user: User) {

    const db = MongoContainer.getDB();

    token.client = client._id;
    token.user = user._id;
    token.status = OauthTokenStatus.active;

    await db.oauth.tokens.insertOne(token);

    return token;
  }
  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   * @param user
   * @param client
   * @param scope
   */
  public async validateScope(user: User, client: OauthClient, scope: string) {
    return 'read';
  }
  /**
   * Invoked to retrieve an existing access token previously saved through :ref:`Model#saveToken() <Model#saveToken>`.
   * @param accessToken
   */
  public async getAccessToken(accessToken: string) {
    let token: OauthToken = await this.redis.getAccessToken(accessToken);
    let user: User;
    if (token) {
      user = await this.redis.getUser(token.user);
      if (user) {
        token.user = user;
        return token;
      }
    }

    const db = MongoContainer.getDB();

    token = await db.oauth.tokens.findOne({accessToken});

    if ((!token) || (token.status === OauthTokenStatus.expired)) {
      throw new Error('invalid_accessToken');
    }

    if (token.accessTokenExpiresAt < new Date) {
      throw new Error('invalid_accessToken_expire');
    }

    user = await db.user.findOne({_id: token.user});
    delete user.password;

    await this.redis.setAccessToken(token);
    await this.redis.setUser(user);
    token.user = user;

    return token;
  }
  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   * @param token
   * @param scope
   */
  public async verifyScope(token: OauthToken, scope: string) {
    // console.log(scope);
    return token.scope === scope;
  }
  /**
   * Invoked to revoke a refresh token.
   * @param {Object} token
   */
  public async revokeToken(token: OauthToken) {
    const db = MongoContainer.getDB();
    await db.oauth.tokens.findOneAndUpdate({_id: token._id}, {$set: {status: OauthTokenStatus.expired}});
    return true;
  }
};