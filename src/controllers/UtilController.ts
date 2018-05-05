import * as Express from 'express';

import {RestController, Get, Post, Res, Req, Inject, QueryParam, BodyParam, Next} from 'mvc';

import {YunPianSms} from '../vendor/YunPianSms';
import { YunPianService } from '../services/YunPianService';
import { CodePen } from '../lib/CodePen';
import { ImageCodeRedisService, UserService } from '../services';

import * as Util from '../utils/util';
import { DefinedError } from '../model/DefinedError';
import { RsaUtil } from '../utils/rsa';
import { User } from '../model';

@RestController('/util')
export class UtilController {

  @Inject()
  private yunpianService: YunPianService;

  @Inject()
  private codePen: CodePen;

  @Inject()
  private rsaUtil: RsaUtil;

  @Inject()
  private imageCodeRedis: ImageCodeRedisService;

  @Inject()
  private userService: UserService;

  @Post('/sms')
  public async smsAction(@BodyParam('mobile') mobile: string, @BodyParam('code') code: string, @BodyParam('hex') hex: string, @Res() res: Express.Response) {

    const user: User = await this.userService.findByMobile(mobile);
    if (user) {
      throw new DefinedError(400, 'user_exists');
    }

    if(!code && !hex) {
      throw new DefinedError(400, 'invalid_code');
    }

    if (hex) {
      const decrypt = this.rsaUtil.decryptFromHex(hex);

      if (decrypt !== mobile) {
        throw new DefinedError(400, 'invalid_hex');
      }

    } else {
      const codeBindMobile = await this.imageCodeRedis.getMobileByCode(code.toUpperCase());
      if(codeBindMobile !== mobile) {
        throw new DefinedError(400, 'invalid_params');
      }
      await this.imageCodeRedis.delOldCode(mobile);
    }

    const sms: string = this.yunpianService.generateSmsCode();
    await this.yunpianService.bindCodeWithMobile(mobile, sms);

    const result = await this.yunpianService.sendSmsCode(mobile, sms);

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