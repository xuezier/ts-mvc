import {Model, ConfigContainer} from 'mvc';

@Model()
export class YunPianSmsConfigModel {
  apikey: string = ConfigContainer.get('vendor.yunpian.apikey');
  SENDSINGLEINTERNATIONALSMSURL: string = 'https://sms.yunpian.com/v2/sms/single_send.json';
  SENDSINGLESMSURL: string = 'https://sms.yunpian.com/v2/sms/single_send.json';
  SENDSINGLEVOICECODEURL: string = 'https://voice.yunpian.com/v2/voice/send.json';
}

export interface SmsError {
  code: number;
  msg: string;
  count: number;
  fee: number;
  unit: string;
  mobile: string;
  sid: number;
}

export function SmsCodeTemplate(code: string): string {
  return `【T立方】您的验证码是${code}`;
}