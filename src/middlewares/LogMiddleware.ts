import {Middleware, IMiddleware, Data, Next} from 'mvc';
import * as Express from 'express';

@Middleware({order: 0})
export class LogMiddleware implements IMiddleware {
  public use(@Data()data: any, @Next() next: Express.NextFunction) {
    data.message = 'global middleware';
    // console.log(data);
    next();
  }
}
