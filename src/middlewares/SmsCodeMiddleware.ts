import * as Express from 'express';

import {Middleware, IMiddleware, BodyParam, Res, Next, Inject, Get} from 'mvc';
import { YunPianService } from '../services/YunPianService';
import { SmsRedisService } from '../services/RedisService';

@Middleware({baseUrl: '/util/sms', order: 0})
export class SmsCodeExistsMiddleware implements IMiddleware {

  @Inject()
  private yunpianService: YunPianService;

  public async use(@BodyParam('mobile') mobile: string, @Next() next: Express.NextFunction) {
    const exists = await this.yunpianService.checkCodeExists(mobile);
    if(exists) throw new Error('limit_mobile_code');

    next();
  }
}

@Middleware({baseUrl: '/util/sms', order: 1})
export class SmsCodeDaylyLimitMiddleware implements IMiddleware {

  @Inject()
  private smsRedis: SmsRedisService;

  public async use(@BodyParam('mobile') mobile: string, @Next() next: Express.NextFunction) {
    const limit = await this.smsRedis.getCodeRequestLimit();
    if(limit > 10) throw new Error('limit_mobile_request');

    await this.smsRedis.incrCodeRequest(mobile);

    next();
  }
}

@Middleware({baseUrl: '/user'})
export class CheckSmsCode implements IMiddleware {

  @Inject()
  private smsRedis: SmsRedisService;

  public async use(@BodyParam('mobile') mobile: string, @BodyParam('code') code: string, @Next() next: Express.NextFunction) {

    if(!code) {
      throw new Error('code_not_null');
    }

    const existsCode = await this.smsRedis.getCodeByMobile(mobile);

    if(existsCode === code) {
      next();
    } else {
      throw new Error('invalid_code');
    }
  }
}
