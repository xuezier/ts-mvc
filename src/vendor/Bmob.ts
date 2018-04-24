import * as Http from 'http';

import * as request from 'request';

import {Vendor, ConfigContainer, Inject} from 'mvc';

import {BmobConfigModel, SmsCodeTemplate, SmsCodeRetrunTemplate} from './model/BmobModel';


@Vendor()
export class Bmob {

  @Inject()
  private config: BmobConfigModel;

  private sends: Map<string, any> = new Map();

  private Headers: object = {
    'Content-Type': 'application/json',
    'X-Bmob-Application-Id': this.config.ApplicationID,
    'X-Bmob-REST-API-Key': this.config.RestApiKey
  };

  /**
   * send single sms code
   * @param {String} mobile
   */
  public async sendSmsCode(mobile: string) {
    if (this.sends.has(mobile))
      return Promise.reject('mobile_sending');
    this.sends.set(mobile, true);

    const url = this.config.REQUESTSMSCODEURL;

    return await new Promise((resolve: Function, reject: Function) => {
      const template = new SmsCodeTemplate();
      template.mobilePhoneNumber = mobile;

      request.post(url, {
        headers: this.Headers,
        body: JSON.stringify(template)
      }, (err: Error, res: Http.ImcomingMessage, body: string) => {
        this.sends.delete(mobile);

        if (err) return reject(err);
        console.log(body)
        if (res.statusCode !== 200) return reject('request_smsCode_error');

        const result: SmsCodeRetrunTemplate = JSON.parse(body);

        resolve(result);
      });
    });
  }
}