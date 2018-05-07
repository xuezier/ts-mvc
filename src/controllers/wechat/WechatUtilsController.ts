import * as Express from 'express';

import {RestController, Get, Post, Req, Res, BodyParam, QueryParam, Inject} from 'mvc'
import { Wechat } from '../../vendor/Wechat';

@RestController('/wechat')
export class WechatUtilsController {
  @Inject()
  private wechat: Wechat;

  @Get('/init')
  public async serverTokenVerifyAction(@Req() req: Express.Request, @Res() res: Express.Request) {
    const {signature, timestamp, nonce, echostr} = req.query;

    const check: boolean = this.wechat.checkSignature(signature, timestamp, nonce);

    res.send(check ? echostr : '');
  }
}