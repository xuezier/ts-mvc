import * as Express from 'express';

export interface Response extends Express.Response {
  headersSent: boolean;
  locals: any;
}