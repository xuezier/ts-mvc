export interface IRedisConfig {
  name: string;
  port: number;
  host: string;
  db: number;
  retry_max_value: number;
  password: string;
  prefix: string;
}