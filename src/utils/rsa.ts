import * as crypto from 'crypto';
import * as fs from 'fs';

import {ConfigContainer, Component} from 'mvc';

@Component()
export class RsaUtil {
  private private_key: string = fs.readFileSync(ConfigContainer.get('utils.rsa.private_key'));
  private public_key: string = fs.readFileSync(ConfigContainer.get('utils.rsa.public_key'));

  public decryptFromHex(hex: string): string {
    let arrayBuffer = [];
    for (let i = 0; i < hex.length / 2; i++) {
      arrayBuffer.push(parseInt(hex.substr(i * 2, 2), 16));
    }

    const buffer = new Buffer(arrayBuffer);

    return this.decryptFromBuffer(buffer);
  }

  public decryptFromBuffer(buffer: any): string {
    const decryptHex = crypto.privateDecrypt({
      key: this.private_key,
      // 这里添加padding选项，java中rsa加密默认添加此项，所以统一都添加此项
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);

    return decryptHex.toString('utf-8');
  }
}