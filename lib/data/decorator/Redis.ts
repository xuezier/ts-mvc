import {RedisContainer} from '../RedisContainer';
import { IRedisConfig } from '../interface/IRedisConfig';

export function Redis(config: IRedisConfig) {
  return (target: Function) => {
    process.nextTick(() => {
      RedisContainer.registerClient(target, config);
    });
  };
}