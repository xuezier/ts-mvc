import {Get, Post, Res, Req, RestController, Inject, QueryParam, BodyParam, Next, ApplicationLoader} from 'mvc';

import * as Express from 'express';
import { ApplicationLoader } from '../../server';

import * as OauthServer from 'oauth2-server';

@RestController('/oauth')
export class OauthController {

  @Inject()
  private application: ApplicationLoader;

  @Post('/token')
  public async loginAction(@Req() req: Express.Request, @Res() res: Express.Response, @Next() next: Express.NextFunction) {

    const request = new OauthServer.Request(req);
    const response = new OauthServer.Response(res);
    const token = await this.application.getModel('oauth').token(request, response, next);

    delete token.client;
    delete token.user;
    res.sendJson(token);
  }
}