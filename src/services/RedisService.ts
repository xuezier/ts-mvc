import {Service, Redis} from 'mvc';

@Service()
@Redis({name: 'sms.code', prefix: 'sms.code'})
export class SmsRedisService {

  public async bindCodeWithMobile(mobile: string, code: string): string {
    return await this.client.setex(mobile, 60 * 5, code);
  }

  public async getCodeByMobile(mobile: string): string {
    return await this.client.get(mobile);
  }

  public async incrCodeRequest(mobile) {
    const key = `.request${mobile}`;

    const now = new Date;
    const hours = 23 - now.getHours();
    const munites = 59 - now.getMinutes();
    const seconds = 60 - now.getSeconds();
    const ttl = seconds + munites * 60 + hours * 60 * 60;

    await this.client.incr(key);
    await this.client.expire(key, ttl);
  }

  public async getCodeRequestLimit(mobile): number {
    const key = `.request${mobile}`;

    const limit: number = await this.client.get(key);

    return limit ? limit : 0;
  }
}