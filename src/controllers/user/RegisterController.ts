import {Get, Post, Res, Req, RestController, Inject, QueryParam, BodyParam, Next} from 'mvc';

import {UserService} from '../../services';
import {User} from '../../model';

import {YunPianSms} from '../../vendor/YunPianSms';

import {MongoContainer} from 'mvc/lib/data/MongoContainer';

import * as Express from 'express';
import { SmsRedisService } from '../../services/RedisService';

@RestController('/user')
export class RegisterConteoller {

  @Inject()
  private userService: UserService;

  @Inject()
  private yunPian: YunPianSms;

  @Inject()
  private smsRedis: SmsRedisService;

  @Post('/')
  public async checkSmsCodeMiddleware(@BodyParam('mobile') mobile: string, @BodyParam('code') code: string, @Next() next: Express.NextFunction) {
    if (!code) {
      throw new Error('code_not_null');
    }

    const existsCode = await this.smsRedis.getCodeByMobile(mobile);

    if (existsCode === code) {
      next();
    } else {
      throw new Error('invalid_code');
    }
  }

  @Post('/')
  public async createAction(
    @BodyParam('mobile') mobile: string,
    @BodyParam('email') email: string,
    @BodyParam('password') password: string,
    @Res() res: Express.Response) {

    try {
      let user: User;

      if (mobile) {
        user = await this.userService.findByMobile(mobile);
      } else if (email) {
        user = await this.userService.findByEmail(email);
      } else {
        throw new Error('invalid_register');
      }

      if (user) {
        throw new Error('user_exists');
      }

      user = await this.userService.createUser({mobile, email, password});

      res.sendJson(user);
    } catch (e) {
      throw e;
    }
  }
}