import {Middleware} from '../../server/lib/meta/decorator/Middleware';
import {IMiddleware} from '../../server/lib/meta/interface/IMiddleware';
import {Res, Next} from '../../server/lib/meta/decorator/Params';
import * as Express from 'express';

@Middleware({order: 1})
export class SendJsonMiddleware implements IMiddleware {
  public use(@Res() res: Express.Response, @Next() next: Express.NextFunction) {
    res.sendJson = function sendJson(
      status: number|object,
      data: object|string,
      message: string|undefined) {
        if (typeof status === 'object') {
          message = data;
          data = status;
          status = 200;
        }
        res.json({
          status,
          data,
          message
        });
    };
    next();
  }
}