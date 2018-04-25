import * as Express from 'express';

import {RestController, Post, Get, Put, Delete, Inject} from 'mvc';

@RestController('/api/goods')
export class GoodsController {

  @Post('/')
  public async createAction(@Req() req: Express.Request, @Res() res: Express.Response) {

  }
}