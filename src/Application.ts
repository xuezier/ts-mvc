import {ApplicationLoader, ApplicationSettings} from '../server';

import './middlewares';
import './controllers/HelloController';

@ApplicationSettings({rootDir: `${__dirname}/../`})
export class Application extends ApplicationLoader {

}