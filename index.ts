// server utils path alias
import 'module-alias/register';

import * as dotenv from 'dotenv';

// enable .env file effect in typescript
dotenv.config();

import {Application} from './src/Application';
new Application().start();

process.on('uncaughtException', (err: Error) => {
  console.error('Caught exception: ' + err.stack);
});
