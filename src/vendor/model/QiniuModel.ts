import * as Qiniu from 'qiniu';

import {Model, ConfigContainer} from 'mvc';

@Model()
export class QiniuConfigModel {
  ACCESS_KEY: string = ConfigContainer.get('vendor.qiniu.ACCESS_KEY');
  SECRET_KEY: string = ConfigContainer.get('vendor.qiniu.SECRET_KEY');
  BUCKET: string = ConfigContainer.get('vendor.qiniu.BUCKET');
  SERVER_URL: string = ConfigContainer.get('vendor.qiniu.SERVER_URL');

  TOKEN_EXPIRE: number = ConfigContainer.get('vendor.qiniu.TOKEN_EXPIRE');

  constructor() {
    Qiniu.conf.ACCESS_KEY = this.ACCESS_KEY;
    Qiniu.conf.SECRET_KEY = this.SECRET_KEY;
  }
}

export class QiniuUploadResultModel {
  hash: string;
  key: string;
  persistenId: string;
}