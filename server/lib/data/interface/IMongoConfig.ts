export interface IMongoConfig {
  host: string;
  port: number;
  database: string;
  options: {
    poolSize: number;
    ssl: boolean;
    sslValidate: boolean;
    sslCA: string;
    sslCert: string;
    sslKey: string;
    sslPass: string;
    sslCRL: string;
    autoReconnect: boolean;
    noDelay: boolean;
    keepAlive: boolean;
    keepAliveInitialDelay: number;
    connectTimeoutMS: number;
  };
}