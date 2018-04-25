import {Service, Inject} from 'mvc';

import {SmsCode} from '../model';

import {YunPianSms} from '../vendor/YunPianSms';

import {SmsRedisService} from './RedisService';
import { SmsError } from '../vendor/model/YunPianSmsConfigModel';

@Service()
export class YunPianService {

  @Inject()
  private smsCode: SmsCode;

  @Inject()
  private yunpian: YunPianSms;

  @Inject()
  private redis: SmsRedisService;

  public generateSmsCode(): string {
    return parseInt(Math.random() * 10000) + '';
  }

  public async sendSmsCode(mobile: string, code: string) {
    var sms = new SmsCode();

    try {
      sms = await this.yunpian.sendSingleSmsCode(mobile, code);
    } catch (e: SmsError) {
      if (e instanceof Error) {
        throw e;
      }
      sms = e;
    }
    sms.mobile = mobile;
    sms.code = code;
    sms.create_at = new Date;
    // console.log(sms);
    return await this.smsCode.getCollection().insertOne(sms);
  }

  public async bindCodeWithMobile(mobile: string, code: string) {
    return await this.redis.bindCodeWithMobile(mobile, code);
  }

  public async checkCodeExists(mobile: string) {
    return await this.redis.getCodeByMobile(mobile);
  }
}