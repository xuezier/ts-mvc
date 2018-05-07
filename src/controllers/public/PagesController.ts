import * as Express from 'express';

import {RestController, Res, Get, ConfigContainer} from 'mvc';

@RestController('/public')
export class PagesController {

  @Get('/wechat')
  public async wechatAction(@Res() res: Express.Response) {
    res.render('pages/wechat', {
      appid: ConfigContainer.get('vendor.wechat.appid'),
      server: ConfigContainer.get('vendor.wechat.server')
    });
  }

}