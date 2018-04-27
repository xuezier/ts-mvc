import * as Express from 'express';

import {RestController, Get, Post, Res, Req, Inject, QueryParam, BodyParam, Next} from 'mvc';

import {YunPianSms} from '../vendor/YunPianSms';
import { YunPianService } from '../services/YunPianService';
import { CodePen } from '../lib/CodePen';
import { ImageCodeRedisService } from '../services';

import * as Util from '../utils/util';
import { DefinedError } from '../model/DefinedError';

@RestController('/util')
export class UtilController {

  @Inject()
  private yunpianService: YunPianService;

  @Inject()
  private codePen: CodePen;

  @Inject()
  private imageCodeRedis: ImageCodeRedisService;

  @Post('/sms')
  public async smsAction(@BodyParam('mobile') mobile: string, @BodyParam('code') code: string, @Res() res: Express.Response) {
    if(!code) {
      throw new DefinedError(400, 'invalid_code');
    }

    const codeBindMobile = await this.imageCodeRedis.getMobileByCode(code.toUpperCase());
    if(codeBindMobile !== mobile) {
      throw new DefinedError(400, 'invalid_params');
    }

    const sms: string = this.yunpianService.generateSmsCode();

    await this.yunpianService.bindCodeWithMobile(mobile, sms);

    const result = await this.yunpianService.sendSmsCode(mobile, sms);

    await this.imageCodeRedis.delOldCode(mobile);

    res.sendJson(result);
  }

  @Get('/code/image')
  public async imageCodeAction(@QueryParam('mobile') mobile: string, @Res() res: Express.Response) {

    if(!Util.testMobile(mobile)) {
      throw new DefinedError(400, 'invalid_mobile');
    }

    const mobileExists: boolean = await this.imageCodeRedis.mobileExists(mobile);
    if(mobileExists) {
      await this.imageCodeRedis.delOldCode(mobile);
    }

    const code = await this.codePen.drawCode();

    await this.imageCodeRedis.bindImageCodeWithMobile(code.code, mobile);

    res.setHeader('Content-Type', 'image/png');
    code.pngStream.pipe(res);
  }
}