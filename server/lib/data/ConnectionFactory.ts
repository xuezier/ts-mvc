import * as Path from 'path';
import {ConfigContainer} from '../config/ConfigContainer';
import {IMongoConfig} from './interface/IMongoConfig';
import {IMongoDb} from './interface/IMongoDb';
import * as Knex from 'knex';
import * as mongodb from 'mongodb';

export class ConnectionFactory {

  private static connection : Knex | IMongoDb;

  public static async init(configDir: string,dbDir: string, env: string) {
    console.log(env)
    const databaseConfig = Path.join(configDir, 'database.json');

    ConfigContainer.registerConfig(databaseConfig);

    const config = ConfigContainer.get('database');
    if (config && Object.keys(config).length) {

      if (config.type === 'mongodb') {
        const mongoConfig: IMongoConfig = ConfigContainer.get(`database.${env}`);
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect(`mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`);
        const db: IMongoDb = client.db();
        this.connection = db;
      } else {
        this.connection = Knex(ConfigContainer.get(`database.${env}`));
        console.log(ConfigContainer.get('database'));
      }
    }
  }

  public static getConnection() {
    return this.connection;
  }
}