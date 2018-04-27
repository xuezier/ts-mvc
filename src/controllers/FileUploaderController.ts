import * as Express from 'express';
import * as Mongodb from 'mongodb';

import {Get, Post, Res, Req, RestController, Inject, QueryParam, PathParam} from 'mvc';
import { QiNiu } from '../vendor/Qiniu';
import { FileService } from '../services';
import { UploadFile, File } from '../model';
import { DefinedError } from '../model/DefinedError';

@RestController('/api/file')
export class FileUploaderController {
  @Inject()
  private qiniu: QiNiu;

  @Inject()
  private fileService: FileService;

  @Post()
  public async uploadAction(@Req() req: Express.Request, @Res() res: Express.Response) {
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

  @Get('/:_id')
  public async loadAction(@PathParam('_id') _id: string, @Res() res: Express.Response) {
    _id = Mongodb.ObjectID(_id);

    const file: File = await this.fileService.getFileById(_id);
    const link = this.fileService.generateFileLink(file.cdn.key);
    res.redirect(301, link);
  }

  @Get('/download/:_id')
  public async downloadAction(@PathParam('_id') _id: string, @Res() res: Express.Response) {
    _id = Mongodb.ObjectID(_id);

    const file: File = await this.fileService.getFileById(_id);
    const downloadLink = this.fileService.genetateFileDownloadLink(file.cdn.key, file.name);

    res.redirect(301, downloadLink);
  }
}