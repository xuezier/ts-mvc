import * as PromiseRedis from 'redis-promised';
import * as Redis from 'redis';
import { IRedisConfig } from './interface/IRedisConfig';

export class RedisContainer {
  private static clients: {client: Redis.RedisClient, name: string}[] = [];

  public static async registerClient(target: any, config: IRedisConfig) {
    let name: string = config.name || 'default';

    if(this.getClient(name)) return;

    delete config.name;
    const client: Redis.RedisClient = PromiseRedis.promiseRedis(config);

    if(target.constructor) {
      target.prototype.client = client;
    }

    this.clients.push({client, name});
  }

  public static getClient(name: string) {
    if(!name) {
      name = 'default';
    };

    const redis = this.clients.find(client => {
      return client.name === name;
    });

    if(!redis) {
      return null;
    }

    return redis.client;
  }
}