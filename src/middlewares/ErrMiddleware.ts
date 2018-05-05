import * as Express from 'express';
import {ErrorMiddleware, IMiddleware, Err, Res} from 'mvc';

import {DefinedErrors} from '../lib/DefinedError';
import { DefinedError } from '../model/DefinedError';

@ErrorMiddleware()
export class ErrMiddleware implements IMiddleware {

  public use(@Err() err: any, @Res() res: Express.Response) {
    // console.log(err);
    const {message, status, description} = err;

    let e: DefinedError;
    if (message in DefinedErrors) {
      e = DefinedErrors[message];
      if (status) e.status = status;
      if (!e.status) e.status = 400;
      if (description) e.description = description;
      if (!e.description) e.description = message;

      e.message = message;
    } else if (err instanceof DefinedError) {
      if(!err.status) err.status = 400;
      if(!err.description) err.description = err.message;
      e = err;
    } else {
      e = {
        status: 500,
        message
      };
      console.error(err.stack);
    }
    res.status(e.status);
    res.json(e);
  }
}