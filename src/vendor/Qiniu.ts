import * as Qiniu from 'qiniu';
import * as Request from 'request';
import * as Url from 'url';

import {Vendor, Inject} from 'mvc';

import {QiniuConfigModel, QiniuUploadResultModel} from './model/QiniuModel';

@Vendor()
export class QiNiu {
  @Inject()
  private config: QiniuConfigModel;

  private qiniuClient = new Qiniu.rs.BucketManager();

  private util = Qiniu.util;

  public switchBucket(BUCKET: string, SERVER_URL: string) {
    this.config.BUCKET = BUCKET;
    this.config.SERVER_URL = SERVER_URL;
  }

  private _reGenerateSavekey(savekey: string, folder: string[]): string {
    if (folder) {
      savekey = `${folder.join('/')}/${savekey}`;
    }

    return savekey;
  }

  private _generateToken(key: string): string {
    const putPolicy: Qiniu.rs.PutPolicy = {
      scope: `${this.config.BUCKET}:${key}`,
      deadline: Math.floor(+new Date) + 3600
    };

    const encodedPutPolicy = this.util.base64ToUrlSafe(new Buffer(JSON.stringify(putPolicy)).toString('base64'));
    const sign: string = this.util.hmacSha1(encodedPutPolicy, this.config.SECRET_KEY);
    const encodedSign = this.util.base64ToUrlSafe(sign);
    const uploadToken = `${this.config.ACCESS_KEY}:${encodedSign}:${encodedPutPolicy}`;

    return uploadToken;
  }

  private async _uploadFile(token: string, key: string, filePath: string) {
    const formUploader = new Qiniu.form_up.FormUploader();

    return new Promise((resolve, reject) => {
      const extra = new Qiniu.form_up.PutExtra();

      formUploader.putFile(token, key, filePath, extra, (err: Error, ret: QiniuUploadResultModel) => {
        if(err) return reject(err);

        resolve(ret);
      })
    });
  }

  public async upload(savekey: string, filePath: string, folder: string[]): QiniuUploadResultModel {
    const key = this._reGenerateSavekey(savekey, folder);

    const token = this._generateToken(key);

    const result: QiniuUploadResultModel = await this._uploadFile(token, key, filePath);

    result.server_url = this.config.server_url;
    return result;
  }

  private async _uploadFileByStream(token: string, key: string, stream: any) {
    const formUploader = new Qiniu.form_up.FormUploader();

    return new Promise((resolve: Function, reject: Function) => {
      var extra = new Qiniu.form_up.PutExtra();

      formUploader.putStream(token, key, stream, extra, (err: Error, ret: QiniuUploadResultModel, info: {}) => {
        if(err) return reject(err);

        if(info.statusCode === 200) return resolve(ret);

        reject({info, body: ret});
      });
    });
  }

  public async streamUpload(savekey: string, stream: any, folder: string[]): QiniuUploadResultModel {

    const key = this._reGenerateSavekey(savekey, folder);
    const token = this._generateToken(key);

    const result: QiniuUploadResultModel = await this._uploadFileByStream(token, key, stream);

    result.server_url = this.config.SERVER_URL;

    return result;
  }
}