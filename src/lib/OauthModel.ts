import {MongoContainer} from 'mvc';

import {User, OauthClient} from '../model';

import * as Util from '../utils/util';
export const OauthModel = {
  /**
   * Invoked to generate a new access token.
   * @param {Object} client
   * @param {Object} user
   * @param {String} scope
   * @param {Function} callback
   */
  async generateAccessToken(client: object, user: object, scope: string) {

  },
  /**
   * Invoked to generate a new refresh token.
   * @param {Object} client
   * @param {Object} user
   * @param {String} scope
   * @param {Function} callback
   */
  async generateRefreshToken(client: object, user: object, scope: string) {

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

    return user;
  },
  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   * @param {Object} token
   * @param {Object} client
   * @param {Object} user
   * @param {Function} callback
   */
  async saveToken(
    token: {
      accessToken: string,
      accessTokenExpiresAt: Date,
      refreshToken: string,
      refreshTokenExpiresAt: Date,
      scope: string
    },
    client: object,
    user: object,
    callback: Function) {

  },
  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   * @param user
   * @param client
   * @param scope
   * @param callback
   */
  async validateScope(
    user: obejct,
    client: {
      id: object
    },
    scope: string,
    callback: Function) {

  },
  /**
   * Invoked to retrieve an existing access token previously saved through :ref:`Model#saveToken() <Model#saveToken>`.
   * @param accessToken
   * @param callback
   */
  async getAccessToken(accessToken: string) {

  },
  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   * @param token
   * @param scope
   * @param callback
   */
  async verifyScope(
    token: {
      accessToken: string,
      accessTokenExpiresAt: Date,
      scope: string,
      client: {
        id: object
      },
      user: object
    },
    scope: string,
    callback: Function) {

  },
  /**
   * Invoked to revoke a refresh token.
   * @param {Object} token
   */
  revokeToken(
    token: {
      refreshToken: string,
      refreshTokenExpiresAt: Date,
      scope: string,
      client: {
        id: object
      },
      user: User,
    }) {

  }
}