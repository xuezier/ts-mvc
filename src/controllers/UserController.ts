import {Get, Post, Res, Req, RestController, Inject, QueryParam, BodyParam} from 'mvc';

import {UserService} from '../services';
import {User} from '../model';

import {MongoContainer} from 'mvc/lib/data/MongoContainer';

import * as Express from 'express';

@RestController('/user')
export class UserConteoller {

  @Inject()
  private userService: UserService;

  @Post('/')
  public async createAction(
    @BodyParam('mobile') mobile: string,
    @BodyParam('email') email: string,
    @BodyParam('password') password: string,
    @Res() res: Express.Response) {

    try {
      let user: User = await this.userService.createUser({mobile, email, password});

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