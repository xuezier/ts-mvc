import {Get, Res, RestController, Inject, QueryParam} from 'mvc';

import {UserService} from '../services';

import {MongoContainer} from 'mvc/lib/data/MongoContainer';

import {YunPianSms} from '../vendor/YunPianSms';
import {Bmob} from '../vendor/Bmob';

import * as Express from 'express';

@RestController('/')
export class HealthcheckController {

    @Inject()
    private userService: UserService;

    @Inject()
    private yunpian: YunPianSms;

    @Inject()
    private bmob: Bmob;

    @Get('/say')
    public async indexAction(@QueryParam('q') q: string, @QueryParam('k') k: string, @Res() res: Express.Response) {
      let user = await this.userService.findById('5ad45eea4dd34c98abd9fea9');
      await this.bmob.sendSmsCode('18705928625');
      res.sendJson({name: 'heiheihei', user});
      this.yunpian.send()
    }

}