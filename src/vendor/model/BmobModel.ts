import {Model, ConfigContainer} from 'mvc';

@Model()
export class BmobConfigModel {
  ApplicationID: string = ConfigContainer.get('vendor.bmob.ApplicationID');
  RestApiKey: string = ConfigContainer.get('vendor.bmob.RestApiKey');

  REQUESTSMSCODEURL: string = 'https://api.bmob.cn/1/requestSmsCode';
  VERIFYSMSCODEURL: string = 'https://api.bmob.cn/1/verifySmsCode/smsCode';
}

export class SmsCodeTemplate {
  mobilePhoneNumber: string;
  template: string;
}

export class SmsCodeRetrunTemplate {
  smsId: string;
}

export class SmsCodeVerifyTemplate {
  mobilePhoneNumber: string;
}

export class SmsCodeVerifyReturnTemplate {
  msg: string
}