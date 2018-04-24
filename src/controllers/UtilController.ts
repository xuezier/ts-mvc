import * as Express from 'express';

import {RestController, Get, Post, Res, Req, Inject, QueryParam, BodyParam} from 'mvc';

import {YunPianSms} from '../vendor/YunPianSms';
import { YunPianService } from '../services/YunPianService';

@RestController('/util')
export class UtilController {

  @Inject()
  private yunpianSerivce: YunPianService;

  @Post('/sms')
  public async smsAction(@BodyParam('mobile') mobile: string, @Res() res: Express.Response) {

    const code = this.yunpianSerivce.generateSmsCode();

    await this.yunpianSerivce.bindCodeWithMobile(mobile, code);

    const result = await this.yunpianSerivce.sendSmsCode(mobile, code);

    res.sendJson(result);
  }
}