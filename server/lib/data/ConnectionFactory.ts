import * as Path from 'path';
import {ConfigContainer} from '../config/ConfigContainer';
import * as Knex from 'knex';

export class ConnectionFactory {

  private static connection: Knex;

  public static async init(configDir: string, env: string) {

    const databaseConfig = Path.join(configDir, 'database.json');

    ConfigContainer.registerConfig(databaseConfig);

    if (ConfigContainer.get('database') && Object.keys(ConfigContainer.get('database')).length) {
      this.connection = Knex(ConfigContainer.get(`database.${env}`));
      console.log(ConfigContainer.get('database'));
    }

  }

  public static getConnection() {
    return this.connection;
  }
}