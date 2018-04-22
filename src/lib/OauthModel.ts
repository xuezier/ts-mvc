import {MongoContainer, Inject} from 'mvc';

import {User, OauthClient, OauthToken} from '../model';

import * as Util from '../utils/util';
export const OauthModel = {
  /**
   * Invoked to generate a new access token.
   * @param {Object} client
   * @param {Object} user
   * @param {String} scope
   * @param {Function} callback
   */
  // async generateAccessToken(client: object, user: object, scope: string) {

  // },
  /**
   * Invoked to generate a new refresh token.
   * @param {Object} client
   * @param {Object} user
   * @param {String} scope
   * @param {Function} callback
   */
  // async generateRefreshToken(client: object, user: object, scope: string) {

  // },
  /**
   * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
   * @param {String} refreshToken
   */
  async getRefreshToken(refreshToken: string) {
    const db = MongoContainer.getDB();

    const token: OauthToken = await db.oauth.tokens.findOne({refreshToken});
    if (!token) {
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
  },
  /**
   * nvoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
   * @param {String} clientId
   * @param {String} clientSecret
   * @param {Function} callback
   */
  async getClient(clientId: string, clientSecret: string) {
    const db = MongoContainer.getDB();
    const client: OauthClient = await db.oauth.clients.findOne({client_id: clientId});
    if(!client) return null;

    if(clientSecret !== client.client_secret) {
      throw new Error('invalid_clientSecret');
    }

    return client;
  },
  /**
   * Invoked to retrieve a user using a username/password combination.
   * @param {String} username
   * @param {String} password
   * @param {Function} callback
   */
  async getUser(username: string, password: string) {
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

    if(!user) return null;

    const pass = user.password;

    const hash = Util.md5(password + pass.salt);

    if(!(hash === pass.hash)) {
      throw new Error('invalid_password');
    }

    delete user.password;
    return user;
  },
  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   * @param {Object} token
   * @param {Object} client
   * @param {Object} user
   */
  async saveToken(token: OauthToken, client: OauthClient, user: User) {

    const db = MongoContainer.getDB();

    token.client = client._id;
    token.user = user._id;
    token.status = 'actived';

    await db.oauth.tokens.insertOne(token);

    return token;
  },
  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   * @param user
   * @param client
   * @param scope
   */
  async validateScope(user: User, client: OauthClient, scope: string) {
    return 'read';
  },
  /**
   * Invoked to retrieve an existing access token previously saved through :ref:`Model#saveToken() <Model#saveToken>`.
   * @param accessToken
   */
  async getAccessToken(accessToken: string) {
    const db = MongoContainer.getDB();

    const token: OauthToken = await db.oauth.tokens.findOne({accessToken});

    if(!token) {
      throw new Error('invalid_accessToken');
    }

    if(token.accessTokenExpiresAt < new Date) {
      throw new Error('invalid_accessToken_expire');
    }

    const user: User = await db.user.findOne({_id: token.user});
    delete user.password;
    token.user = user;

    return token;
  },
  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   * @param token
   * @param scope
   */
  async verifyScope(token: OauthToken, scope: string) {
    console.log(scope);
    return token.scope === scope;
  },
  /**
   * Invoked to revoke a refresh token.
   * @param {Object} token
   */
  async revokeToken(token: OauthToken) {
    const db =MongoContainer.getDB();
    await db.oauth.tokens.findOneAndUpdate({_id: token._id}, {$set: {status: 'expired'}});
    return true;
  }
}