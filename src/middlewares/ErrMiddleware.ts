import {ErrorMiddleware} from '../../server/lib/meta/decorator/Middleware';
import {IMiddleware} from '../../server/lib/meta/interface/IMiddleware';
import {Err, Res} from '../../server/lib/meta/decorator/Params';
import * as Express from 'express';

@ErrorMiddleware()
export class ErrMiddleware implements IMiddleware {

  public use(@Err() err: any, @Res() res: Express.Response) {
    console.log(err);
    res.send(err.message);
  }

}