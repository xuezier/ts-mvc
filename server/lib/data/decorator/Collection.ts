import {MongoContainer} from '../MongoContainer';

export function Collection(name?: string) {
  return (target: Function) => {
    process.nextTick(() => {
      MongoContainer.registerCollection(target, name);
    });
  };
}