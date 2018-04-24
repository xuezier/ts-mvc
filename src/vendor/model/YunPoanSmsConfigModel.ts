import {Model, ConfigContainer} from 'mvc';

@Model()
export class YunPoanSmsConfigModel {
  apikey: string = ConfigContainer.get('vendor.yunpian.apikey');
  SENDSINGLEINTERNATIONALSMSURL: string = 'https://sms.yunpian.com/v2/sms/single_send.json';
  SENDSINGLESMSURL: string = 'https://sms.yunpian.com/v2/sms/single_send.json';
  SENDSINGLEVOICECODEURL: string = 'https://voice.yunpian.com/v2/voice/send.json';
}