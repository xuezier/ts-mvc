import {Get, Post, Res, Req, RestController, Inject, QueryParam, BodyParam} from 'mvc';

import {UserService} from '../services';
import {User} from '../model';

import {YunPianSms} from '../vendor/YunPianSms';

import {MongoContainer} from 'mvc/lib/data/MongoContainer';

import * as Express from 'express';

@RestController('/user')
export class UserConteoller {

  @Inject()
  private userService: UserService;

  @Inject()
  private yunPian: YunPianSms;

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

  @Get('/')
  public async infoAction(@Req() req: Express.Request, @Res() res: Express.Response) {
    const user: User = req.user;

    res.sendJson(user);
  }
}