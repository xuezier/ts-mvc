import {MongoContainer} from '../MongoContainer';

export function Collection(name?: string) {
  return (target: Function) => {
    console.log(target.constructor.toString())
    process.nextTick(() => {
      MongoContainer.registerCollection(target, name);
    });
  }
}