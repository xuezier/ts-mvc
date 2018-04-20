import {Middleware} from '../../server/lib/meta/decorator/Middleware';
import {IMiddleware} from '../../server/lib/meta/interface/IMiddleware';
import {Data, Next} from '../../server/lib/meta/decorator/Params';
import * as Express from 'express';

@Middleware({order: 0})
export class LogMiddleware implements IMiddleware {
  public use(@Data()data: any, @Next()next: Express.NextFunction) {
    data.message = 'global middleware';
    console.log(data);
    next();
  }
}
