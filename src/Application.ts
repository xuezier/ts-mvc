import {ApplicationLoader, ApplicationSettings} from '../server';

import {Collection} from '../server/lib/data/decorator/Collection';

import './middlewares';
import './controllers/HelloController';

@ApplicationSettings({rootDir: `${__dirname}/../`})
export class Application extends ApplicationLoader {

}

@Collection('admin')
@Collection('test')
class database {

}