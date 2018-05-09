import * as QueryString from 'querystring';

import * as Express from 'express';

import {RestController, Get, Post, Req, Res, BodyParam, QueryParam, Inject} from 'mvc';
import { Wechat } from '../../vendor/Wechat';
import { User } from '../../model';
import { UserService, OauthAccessTokenRedisService } from '../../services';
import { DefinedError } from '../../model/DefinedError';

@RestController('/wechat')
export class WechatUtilsController {
  @Inject()
  private wechat: Wechat;

  @Inject()
  private userService: UserService;

  @Inject()
  private oauthRedis: OauthAccessTokenRedisService;

  @Get('/init')
  public async serverTokenVerifyAction(@Req() req: Express.Request, @Res() res: Express.Response) {
    const {signature, timestamp, nonce, echostr} = req.query;

    const check: boolean = this.wechat.checkSignature(signature, timestamp, nonce);

    res.send(check ? echostr : '');
  }

  @Get('/oauth')
  public async authorizeAction(@QueryParam('state') state: string, @QueryParam('code') code: string, @Req() req: Express.Request, @Res() res: Express.Response) {
    const query = req.query;
    // { code: '001AwdEw1cpV0b0UIEDw1PaaEw1AwdEO', state: '123' }

    const token = await this.wechat.getAccessTokenByCode(code);
    const existsUser: User = await this.userService.findUserByOpenid(token.openid);

    let statedata: {redirect_url: string} = {};

    let stateArray = state.split('|');

    for(let i = 0; i < (stateArray.length / 2); i++) {
      let index = i * 2;
      statedata[stateArray[index]] = stateArray[index+1];
    }

    // const statedata: {redirect_url: string} = QueryString.parse(state.replace(/\|/g, '='));
    let redirect_url = statedata.redirect_url;
    if (existsUser) {
      await this.wechat.createAuthorizationCode(code, existsUser);
    }

    redirect_url += '?code=' + code;
    res.redirect(redirect_url);
  }

  @Post('/bind')
  public async bindWechatAction(@BodyParam('code') code: string, @Req() req: Express.Request, @Res() res: Express.Request) {
    let user: User = req.user;
    const token = await this.wechat.findAccessTokenByCode(code);

    if(!token) {
      throw new DefinedError(400, 'invalid_authorization_code');
    }

    user = await this.userService.modify(user._id, {wechat: {openid: token.openid}});
    this.oauthRedis.setUser(user);

    res.sendJson(user);
  }
}