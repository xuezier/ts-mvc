import * as Qiniu from 'qiniu';
import * as Request from 'request';
import * as Url from 'url';

import {Vendor, Inject} from 'mvc';

import {QiniuConfigModel, QiniuUploadResultModel} from './model/QiniuModel';

@Vendor()
export class QiNiu {
  @Inject()
  public config: QiniuConfigModel;

  private qiniuClient = new Qiniu.rs.BucketManager();

  private util = Qiniu.util;

  /**
   * switch bucket
   * @param BUCKET
   * @param SERVER_URL
   */
  public switchBucket(BUCKET: string, SERVER_URL: string) {
    this.config.BUCKET = BUCKET;
    this.config.SERVER_URL = SERVER_URL;
  }

  /**
   * re genetate a savekey
   * @param savekey
   * @param folder
   */
  private _reGenerateSavekey(savekey: string, folder: string[]): string {
    if (folder) {
      savekey = `${folder.join('/')}/${savekey}`;
    }

    return savekey;
  }

  /**
   * generate a upload token
   * @param key
   */
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

  /**
   * do upload file
   * @param token
   * @param key
   * @param filePath
   */
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

  /**
   * upload a file
   * @param savekey
   * @param filePath
   * @param folder
   */
  public async upload(savekey: string, filePath: string, folder: string[]): QiniuUploadResultModel {
    const key = this._reGenerateSavekey(savekey, folder);

    const token = this._generateToken(key);

    const result: QiniuUploadResultModel = await this._uploadFile(token, key, filePath);

    result.server_url = this.config.SERVER_URL;
    return result;
  }

  /**
   * do upload a file by a file stream
   * @param token
   * @param key
   * @param stream
   */
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

  /**
   * upload file by file stream
   * @param savekey
   * @param stream
   * @param folder
   */
  public async streamUpload(savekey: string, stream: any, folder: string[]): QiniuUploadResultModel {

    const key = this._reGenerateSavekey(savekey, folder);
    const token = this._generateToken(key);

    const result: QiniuUploadResultModel = await this._uploadFileByStream(token, key, stream);

    result.server_url = this.config.SERVER_URL;

    return result;
  }

  /**
   * do generate a download link
   * @param key
   * @param deadTime
   * @param rename
   */
  private _generateDownloadLink(key: string, deadTime: number, rename: string): string {
    let url: string = Url.resolve(this.config.SERVER_URL, key);

    if(rename) url += `?download/${encodeURIComponent(rename)}`;

    if(deadTime) {
      let e = Math.floor((+new Date) / 1000) + deadTime;
      url += `${url.indexOf('?') > 0 ? '&' : '?'}e=${e}`;
    }

    let signature = this.util.hmacSha1(url, this.config.SECRET_KEY);
    let encodedSign = this.util.base64ToUrlSafe(signature);
    let downloadToken = `${this.config.ACCESS_KEY}:${encodedSign}`;

    const downloadUrl = `${url}&token=${downloadToken}`;
    return downloadToken;
  }

  /**
   * genetate a download link
   * @param key
   * @param deadTime
   * @param rename
   */
  public generateDownloadLink(key: string, deadTime: number, rename: string) {
    const downloadUrl = this._generateDownloadLink(key, deadTime, rename);

    return downloadUrl;
  }

  /**
   * generate a read link
   * @param key
   * @param deadTime
   */
  public generateLink(key: string, deadTime: number) {
    if(arguments.length > 2) return this.generateDownloadLink.apply(this, arguments);

    return this._generateDownloadLink(key, deadTime);
  }

  /**
   * batch generate batch links
   * @param keys
   * @param deadTime
   */
  public batchGenerateLink(keys: string[], deadTime: number) {
    return keys.map(key => this.generateLink(key, deadTime));
  }
}