import {Model, ConfigContainer, Collection} from 'mvc';

@Model()
export class WechatConfigModel {
  appid: string = ConfigContainer.get('vendor.wechat.appid');
  appsecret: string = ConfigContainer.get('vendor.wechat.appsecret');
  token: string = ConfigContainer.get('vendor.wechat.token');

  oauth_client: string = ConfigContainer.get('utils.client.authorization_code');

  ACCESSTOKENURL: string = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.appid}&secret=${this.appsecret}&grant_type=authorization_code&code=`;
  REFRESHTOKENURL: string = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${this.appid}&grant_type=refresh_token&refresh_token=`;
  WECHATUSERINFOURL: string = `https://api.weixin.qq.com/sns/userinfo?lang=zh_CN&`;
}

@Collection('wechat.oauth.token')
@Model()
export class WechatAccessTokenModel {
  code: string;

  access_token: string;
  expires_in: string;
  refresh_token: string;
  openid: string;
  scope: string;

  errcode: number;
  errmsg: string;
}

export enum Sex {
  "M" = 1,
  "F" = 2,
}

@Collection('wechat.user')
@Model()
export class WechatUserModel {
  openid: string;
  nickname: string;
  sex: Sex;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string;
  unionid: string;
}