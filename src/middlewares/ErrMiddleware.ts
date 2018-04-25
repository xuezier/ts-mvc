import * as Express from 'express';
import {ErrorMiddleware, IMiddleware, Err, Res} from 'mvc';

import {DefinedError} from '../lib/DefinedError';
import { DefinedErrorModel } from '../model/DefinedError';

@ErrorMiddleware()
export class ErrMiddleware implements IMiddleware {

  public use(@Err() err: any, @Res() res: Express.Response) {
    // console.log(err);
    const {message, status, description} = err;

    if (message in DefinedError) {
      let e: DefinedErrorModel = DefinedError[message];
      if (status) e.status = status;
      if (!e.status) e.status = 400;
      if (description) e.description = description;
      if (!e.description) e.description = message;

      e.message = e.message;
      res.json(e);
    } else {
      console.error(err.stack);
      res.json({
        status: 500,
        message
      });
    }
  }

}