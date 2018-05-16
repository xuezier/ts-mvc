import * as Mongodb from 'mongodb';

import {ConnectionFactory} from './ConnectionFactory';

export function MongoCollection(collection: Mongodb.Collection, name: string) {
  const connection = ConnectionFactory.getConnection();
  // console.log('get ',name)
  return new Proxy({}, {
    get: (target: Mongodb.Collection, key: string) => {
      if (!(collection instanceof Mongodb.Collection)) return;

      if (collection.__proto__.hasOwnProperty(key) || collection.hasOwnProperty(key)) {
        const res = collection[key];
        if (res instanceof Function) return res.bind(collection);
        return res;
        // return collection[key];
      }

      if (key === '__proto__') {
        return collection[key];
      }

      if (typeof key === 'symbol') {
        return collection[key];
      }

      if (key === 'toBSON') {
        return null;
      }

      if (/^\_/.test(key)) {
        return null;
      }

      let collectionName = `${name}.${key}`;
      return MongoCollection(connection.collection(collectionName), collectionName);
    }
  });
}
