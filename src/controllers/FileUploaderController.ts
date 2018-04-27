import * as Express from 'express';

import {Get, Post, Res, Req, RestController, Inject, QueryParam} from 'mvc';
import { QiNiu } from '../vendor/Qiniu';
import { FileService } from '../services';
import { UploadFile } from '../model';
import { DefinedError } from '../model/DefinedError';

@RestController('/api/file')
export class FileUploaderController {
  @Inject()
  private qiniu: QiNiu;

  @Inject()
  private fileService: FileService;

  @Post('/')
  private async uploadAction(@Req() req: Express.Request, @Res() res: Express.Response) {
    const files: {[key: string]: UploadFile} = req.files

    let keys = Object.keys(files);
    if (keys.length > 1) {
      throw new DefinedError(400, 'file_error', 'not support batch upload');
    }

    for (let key in files) {
      const file = files[key];

      if(file instanceof Array) {
        throw new DefinedError(400, 'file_error', 'not support batch upload');
      }

      const result = await this.fileService.saveCdn(file);
      res.sendJson(result);
    }
  }
}