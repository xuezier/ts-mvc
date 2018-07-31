import * as Express from 'express';

export interface Request extends Express.Request {
  id: string;
  body: any;
  params: any;
  query: any;
  cookies: any,
  header: Function;
}