import {Model, ConfigContainer} from 'mvc';

export class WechatConfigModel {
  appid: string = ConfigContainer.get('vender.wechat.appid');
  appsecret: string = ConfigContainer.get('vender.wechat.appsecret');
  token: string = ConfigContainer.get('vender.wechat.token');
}