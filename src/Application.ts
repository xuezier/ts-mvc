import {ApplicationLoader, ApplicationSettings} from '../server';

import {Collection} from 'mvc';

import './middlewares';
import './controllers/HelloController';

import './model';

@ApplicationSettings({rootDir: `${__dirname}/../`})
export class Application extends ApplicationLoader {

}