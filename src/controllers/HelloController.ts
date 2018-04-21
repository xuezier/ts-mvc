import {Get, Res, RestController, Inject, QueryParam} from 'mvc';

import {UserService} from '../services';

import {MongoContainer} from 'mvc/lib/data/MongoContainer';

import * as Express from 'express';

@RestController('/')
export class HealthcheckController {

    @Inject()
    private userService: UserService;

    @Get('/say')
    public async indexAction(@QueryParam('q') q: string, @QueryParam('k') k: string, @Res() res: Express.Response) {
      let user = await this.userService.findById('5ad45eea4dd34c98abd9fea9');
      res.sendJson({name: 'heiheihei', user});
    }

}