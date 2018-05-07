import * as Cluster from 'cluster';
import * as OS from 'os';
// server utils path alias
import 'module-alias/register';
import * as Express from 'express';

import * as dotenv from 'dotenv';
// enable .env file effect in typescript
dotenv.config();

import * as OauthServer from 'oauth2-server';

import {Application} from './src/Application';

import {OauthModel} from './src/lib/OauthModel';

if(Cluster.isMaster) {
  var cpuCount = OS.cpus().length;

  for (var i = 0; i < cpuCount; i += 1) {
    Cluster.fork();
  }

  Cluster.on('exit', function (worker) {
    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    Cluster.fork();

  });
} else {
  const application = new Application();

  application.server.use(Express.static('public'));
  application.server.set('views', 'public');
  application.server.set('view engine', 'pug');

  application.install('oauth', new OauthServer({
    model: new OauthModel(),
    debug: true,
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 3600 * 24 * 15,
  }));

  application.start();

}

process.on('uncaughtException', (err: Error) => {
  console.error('Caught exception: ' + err.stack);
});
