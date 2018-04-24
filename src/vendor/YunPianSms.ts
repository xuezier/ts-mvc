import * as Http from 'http';

import * as request from 'request';

import {Vendor, ConfigContainer, Inject} from 'mvc';

import {YunPianSmsConfigModel, SmsCodeTemplate} from './model/YunPianSmsConfigModel';

@Vendor()
export class YunPianSms {

  @Inject()
  private config: YunPianSmsConfigModel;

  private sends: Map<string, any> = new Map();

  public async send() {
    console.log(this.config);
  }

  /**
   * convert phone number to +xxxxx
   * @param {String} mobile
   */
  private _convertInternationalPhone(mobile: string): string {
    mobile = decodeURIComponent(mobile);

    if(!/^\+/.test(mobile)) mobile = `+${mobile}`;

    return mobile;
  }

  /**
   * do send single sms
   * @param {String} url
   * @param {String} mobile
   * @param {String} text
   */
  private async _sendSingleSms(url: string, mobile: string, text: string) {
    if(this.sends.has(mobile))
      return Promise.reject('mobile_sending');
    this.sends.set(mobile, true);

    return new Promise((resolve: Function, reject: Function) => {
      request.post(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        form: {
          apikey: this.config.apikey,
          mobile,
          text
        }
      }, (err: Error, res: Http.IncomingMessage, body: string) => {
        this.sends.delete(mobile);

        if(err) return reject(err);

        body = JSON.parse(body);

        if (body.code) {
          return reject(body);
        }
        resolve(body);
      });
    });
  }

  public async sendSingleSms(mobile: string, text: string) {
    const url = this.config.SENDSINGLEINTERNATIONALSMSURL;

    return await this._sendSingleSms(url, mobile, text);
  }

  public async sendSingleSmsCode(mobile: string, code: string) {
    const text = SmsCodeTemplate(code);

    return await this.sendSingleSms(mobile, text);
  }

}