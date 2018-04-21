import * as Mongodb from 'mongodb';

import {ConnectionFactory} from './ConnectionFactory';

export function MongoCollection(collection: Mongodb.Collection, name: string) {
  const connection = ConnectionFactory.getConnection();

  return new Proxy(collection, {
    get: (target: Mongodb.Collection, key: string) => {
      if(!(target instanceof Mongodb.Collection)) return;

      if(key === '__proto__') {
        return target[key];
      }

      if (target.__proto__.hasOwnProperty(key) || target.hasOwnProperty(key)) {
        return target[key];
      }

      if(typeof key === 'symbol') return;
      let collectionName = `${name}.${key}`;
      return MongoCollection(connection.collection(collectionName), collectionName);
    }
  });
}
