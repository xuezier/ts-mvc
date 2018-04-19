import {ApplicationLoader, ApplicationSettings} from '../server';


@ApplicationSettings({rootDir: `${__dirname}/../`})
export class Application extends ApplicationLoader {

}