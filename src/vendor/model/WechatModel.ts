import {Model, ConfigContainer} from 'mvc';

@Model()
export class WechatConfigModel {
  appid: string = ConfigContainer.get('vendor.wechat.appid');
  appsecret: string = ConfigContainer.get('vendor.wechat.appsecret');
  token: string = ConfigContainer.get('vendor.wechat.token');
}