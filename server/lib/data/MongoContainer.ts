import * as Mongodb from 'mongodb';

import {ConnectionFactory} from './ConnectionFactory';
import {MongoCollection} from './MongoCollection';

export class MongoContainer {
  private static _db: ProxyConstructor;

  private static _ObjectID: Function = Mongodb.ObjectID;

  private static Collection: Function = Mongodb.Collection;

  private static collections: {collection: Mongodb.Collection, name: string}[] = [];

  private static beforeRegister: {target: any, name: string}[] = [];

  public static async registerCollection(target: any, name: string) {
    const connection = ConnectionFactory.getConnection();

    if(!connection) {
      // throw new Error('database connection lose');

      ConnectionFactory.on('connected', () => {
        this.runRegister();
      });
      return this.beforeRegister.push({target, name});
    }

    const collection = MongoCollection(connection.collection(name), name);

    if(target.constructor) {
      target.prototype.collection = collection;
    }

    this.collections.push({collection, name});
  }

  public static runRegister() {
    this.beforeRegister.forEach((args) => {
      this.registerCollection(args.target, args.name);
    });

    this.beforeRegister = [];
  }

  public static get ObjectID() {
    return this._ObjectID;
  }

  public static get ObjectId() {
    return this._ObjectID;
  }

  public static getConnection() {
    return ConnectionFactory.getConnection();
  }

  public static getDB() {
    const connection = ConnectionFactory.getConnection();

    if(!this._db) {
      this._db = new Proxy({}, {
        get: (target: object, key: string) => {
          // if((key === 'ObjectId') || (key === 'ObjectID')) {
          //   return this.ObjectID;
          // }

          // if(connection.hasOwnProperty(key) || connection.__proto__.hasOwnProperty(key)) {
          //   return connection[key];
          // }

          const collection = this.collections.find(col => {
            return col.name === key;
          });

          if(collection) {
            return collection.collection;
          } else {
            return this.defineProxy(key);
          }
        }
      });
    }

    return this._db;
  }

  private static defineProxy(name: string) {
    return new Proxy({name}, {
      get: (target: {name: string}, key: string) => {
        const collectionName = `${target.name}.${key}`;

        const collection = this.collections.find(col => {
          return col.name = collectionName;
        });

        if(collection) return collection.collection;

        return this.defineProxy(collectionName);
      }
    });
  }
}