import {ApplicationRegistry} from './ApplicationRegistry';
import * as Express from 'express';
import * as Fs from 'fs';
import * as cuid from 'cuid';

import {ControllerRegistry} from './lib/meta/ControllerRegistry';
import {HandlerTransformer} from './lib/meta/HandlerTransformer';
import {ControllerTransformer} from './lib/meta/ControllerTransformer';
import {MiddlewareRegistry} from './lib/meta/MiddlewareRegistry';
import {DependencyRegistry} from './lib/di/DependencyRegistry';
import {InitializerRegistry} from './lib/initializer/InitializerRegistry';
import {Klass} from './lib/core/Klass';
import {Request} from './lib/meta/interface/Request';
import {RouterLogger} from './lib/util/RouterLogger';

import {ConnectionFactory} from './lib/data/ConnectionFactory';
import {LogFactory} from './lib/logger/LogFactory';

export class ApplicationLoader {
  private _server: Express.Application;

  private _env: string;

  private _rootDir: string;

  private _srcDir: string;

  private _publicDir: string;

  private _logDir: string;

  private _configDir: string;

  private _dbDir: string;

  private _port: string | number;

  // TODO: add routes group support
  private _routes: {[key: string]: string};

  // TODO: add external components support
  private _components: string[];

  get server(){
    return this._server;
  }

  get env(): string {
    return this._env;
  }

  get rootDir(): string {
    return this._rootDir;
  }

  get srcDir(): string {
    return this._srcDir;
  }

  get publicDir(): string {
    return this._publicDir;
  }

  get logDir(): string {
    return this._logDir;
  }

  get configDir(): string {
    return this._configDir;
  }

  get dbDir(): string {
    return this._dbDir;
  }

  get port(): string {
    return this._port;
  }

  constructor() {

    this._server = Express();
    const settings = ApplicationRegistry.settings;

    this._env = process.env.NODE_ENV || settings.env || 'development';

    this._rootDir = settings.rootDir;

    // Assign user defined folder structure to ApplicationLoader
    // If no such folder, then create it
    ['src', 'public', 'log', 'config', 'db'].map(item => {
      this[`_${item}Dir`] = settings[`${item}Dir`] || `${this._rootDir}/${item}`;

      if (!Fs.existsSync(this[`_${item}Dir`]) && this._env !== 'test') {
        Fs.mkdirSync(this[`_${item}Dir`]);
      }
    });


    this._port = process.env.PORT || settings.port || 9000;

    this._components = settings.components || [];
    this._routes = settings.routes || {};

    DependencyRegistry.set(ApplicationLoader, this);

    this.init()
      .invokeApplicationInitHook()
      .loadExternalMiddlewares()
      .loadComponents()
      .loadMiddlewares()
      .loadRoutes()
      .loadErrorMiddlewares();
  }

  public start(): Promise<any> {

    return Promise
      .resolve()
      .then(() => this.run())
      .catch(e => {
        throw e;
      });
  }


  private init() {

    InitializerRegistry
      .getInitializers()
      .forEach(initializer => {
        const instance = DependencyRegistry.get(<Klass>initializer.type);
        instance['init'].apply(instance);
      });

    LogFactory.init(this.configDir, this.logDir, this.env);
    ConnectionFactory.init(this.configDir, this.dbDir, this.env);

    return this;
  }

  private invokeApplicationInitHook() {
    '$onInit' in this ? (<any> this).$onInit() : null;
    return this;
  }

  private loadExternalMiddlewares() {
    const logger = LogFactory.getLogger();

    this.server.use(require('morgan')('combined', {
      stream: {
        write: message => logger.info(message)
      }
    }));

    this.server.use(require('body-parser').json({ limit: '1gb' }));
    this.server.use(require('body-parser').urlencoded({ limit: '1gb', extended: true }));
    this.server.use(require('cookie-parser')());
    this.server.use(require('method-override')());
    this.server.use(require('serve-static')(this.publicDir));

    return this;
  }

  private loadComponents() {

    require('require-all')({
      dirname     :  this.srcDir,
      excludeDirs :  new RegExp(`^\.(git|svn|node_modules|${this.configDir}|${this.logDir}})$`),
      recursive   : true
    });

    return this;
  }

  private loadMiddlewares() {

    MiddlewareRegistry
      .getMiddlewares({isErrorMiddleware: false})
      .forEach(middlewareMetadata => {
        const handlerMetadata = middlewareMetadata.handler;
        const transformer = new HandlerTransformer(handlerMetadata);
        this._server.use(middlewareMetadata.baseUrl, transformer.transform());
      });

    return this;
  }

  private loadRoutes() {
    ControllerRegistry.controllers.forEach(controllerMetadata => {
      const transformer = new ControllerTransformer(controllerMetadata);
      const router = transformer.transform();
      this._server.use(controllerMetadata.baseUrl, router);
    });

    return this;
  }

  private loadErrorMiddlewares() {

    MiddlewareRegistry
      .getMiddlewares({isErrorMiddleware: true})
      .forEach(middlewareMetadata => {
        const handlerMetadata = middlewareMetadata.handler;
        const transformer = new HandlerTransformer(handlerMetadata);
        this._server.use(middlewareMetadata.baseUrl, transformer.transform());
      });

    return this;
  }

  private run() {
    this.server.listen(this.port, () => {
      const logger = LogFactory.getLogger();
      logger.info(`Application is listening on port ${this.port}`);
    });
  }

}