import * as Path from 'path';

import * as Knex from 'knex';
import * as mongodb from 'mongodb';
import {ConfigContainer} from '../config/ConfigContainer';
import {IMongoConfig} from './interface/IMongoConfig';
import {IMongoDb} from './interface/IMongoDb';

export class ConnectionFactory {
  private static connected: boolean = false;
  private static eventMap: Map<string, Function> = new Map();
  private static connection: Knex | IMongoDb;
  private static db: Knex | IMongoDb;

  public static async init(configDir: string, dbDir: string, env: string) {
    const databaseConfig = Path.join(configDir, 'database.json');

    ConfigContainer.registerConfig(databaseConfig);

    const config = ConfigContainer.get('database');
    if (config && Object.keys(config).length) {

      if (config.type === 'mongodb') {
        const mongoConfig: IMongoConfig = ConfigContainer.get(`database.${env}`);
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect(`mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`, mongoConfig.options);
        const db: IMongoDb = client.db();
        this.connection = db;

      } else {
        this.connection = Knex(ConfigContainer.get(`database.${env}`));
      }

      this.connected = true;
      this.emit('connected');
    }
  }

  public static on(eventName: string, callback: Function) {
    if (this.eventMap.has(eventName)) {
      return;
    }
    this.eventMap.set(eventName, callback);
  }

  public static emit(eventName: string) {
    const callback = this.eventMap.get(eventName);
    if (callback) {
      const args = Array.prototype.slice(1);
      callback.apply(callback, args);
    }
  }

  public static getConnection() {
    return this.connection;
  }
}