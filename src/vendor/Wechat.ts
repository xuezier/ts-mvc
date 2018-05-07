import * as Crypto from 'crypto';

import {Vendor, Inject} from 'mvc';
import { WechatConfigModel } from './model/WechatModel';

@Vendor()
export class Wechat {
  @Inject()
  private config: WechatConfigModel;

  public checkSignature(signature: string, timestamp: string, nonce: string): boolean {
    const signArr = [this.config.token, timestamp, nonce].sort();
    const signString = signArr.join('');

    const tempSignature = Crypto.createHash('sha1').update(signString).digest('hex');

    return tempSignature === signature;
  }
}