mvc-ts is a mvc framework bult from express module.
[![NPM version][npm-image]][npm-url]

# Installation
```bash
npm install mvc-ts --save
```

# Usage

## ENV
mvc-ts will read *.env* file to load custom env.
```bash
# Example .env file
PORT=3333
```

# application
```javascript
import {ApplicationLoader, ApplicationSettings} from 'mvc-ts';

@ApplicationSetting({rootDir: __dirname})
class Application extends ApplicationLoader {}

const application = new Application();

application.start();
```
application will start a server on port 3333, and make folders for *config*, *db*, *log*, *public*.

## load model
```javascript
// Example oauth2@3.x
import * as OauthServer from 'oauth2-server';
import {OauthModel} from 'pathToOauthModel';

application.install('oauth', new OauthServer({
    model: new OauthModel(),
    debug: true,
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 3600 * 24 * 15,
}));
```

## Middleware
```javascript
// middleware example for oauth
// file OauthAuthenticateMiddleware.ts
import {Middleware, IMiddleware, Res, Req, Next, ApplicationLoader, Inject} from 'mvc-ts';

import * as Express from 'express';
import * as OauthServer from 'oauth2-server';

@Middleware({baseUrl: '/wechat/bind'})
export class OauthAuthenticationMiddleware extends IMiddleware {
    @Inject()
    private application: ApplicationLoader;

    public async use(
        @Req() req: Express.Request,
        @Res() res: Express.Response,
        @Next() next: Express.NextFunction) {

        const request = new OauthServer.Request(req);
        const response = new OauthServer.Response(res);

        const token = await this.application.getModel('oauth').authenticate(request, response);

        req.user = token.user;
        next();

    }
}
```

## Model
file HellWorldModle.ts
```javascript
import {Model} from 'mvc-ts';

@Model()
export class HelloModel {
    say: string = 'world';
}
```

## Service
file HelloService.ts
```javascript
import {Service, Inject} from 'mvc-ts';
import {HelloModel} from 'pathToHelloModel';

@Service()
export class HelloService {
    @Inject()
    private hello: HelloModel;

    public say() {
        return `hello ${this.hello.say}`;
    }
}
```

## Rest api Controller
example get api controller
```javascript
import * as Express from 'express';

import {RestController, Res, Get, Inject} from 'mvc-ts';

import {HelloService} from 'pathTiHelloService';

@RestController('/')
export class HelloWorldController {
    @Inject()
    private helloService: HelloService;

    @Get('/')
    public async indexAction(@Res() res: Express.Response) {
        let word = this.helloService.say();

        res.send(word);
    }
}
```
now open url *http://127.0.0.1:3333* in browser, it will show *hello world* in the page.

# Config
    define you any config in file __dirname/config/*.json
    and you can get any config value by ConfigContainer
file __dirname/config/utils.json
```json
{
    "client": {
        "mvc": "mvc",
        "authorization_code": "authorization_code"
    }
}
```
file __dirname/config/vendor.json
```json
{
    "yunpian": {
        "apikey": "7b04928caf221bf56e*********"
    }
}
```
file my.ts
```javascript
import {ConfigContainer} from 'mvc-ts';

console.log(ConfigContainer.get('utils.client.mvc'));
// log: mvc
console.log(ConfigContainer.get('utils.client.authorization_code'));
// log: authorization_code
console.log(ConfigContainer.get('vendor.yunpian.apikey'));
// log: 7b04928caf221bf56e*********
```

# Mongodb
    configure self mongodb config in file __dirname/config/database.json

 __dirname/config/database.json
```json
{
    "type": "mongodb",
    "development": {
        "port": 27017,
        "host": "127.0.0.1",
        "database": "test",
        "options": {
            "poolSize": 10
        }
    }
}
```

UserModel.ts
```javascript
import * as Mongodb from 'mongodb';
import {Model, Collection} from 'mvc-ts';

@Collection('user')
@Model()
export class UserModel {
    _id: Mongodb.ObjectID;
    name: string;
    age: number;
    birthday: Date;
}
```

UserService.ts
```javascript
import * as Mongodb from 'mongodb';
import {Service, Inject, MongoContainer} from 'mvc-ts';

import {UserModel} from 'pathToUserModel';

@Service()
export class UserService {
    @Inject()
    private user: UserModel;

    public async getName(_id: Mongodb.ObjectID): Promise<string> {
        let user = await this.user.getCollection().fineOne({_id});
        return user.name
    }

    public async getAge(_id: Mongodb.ObjectID): Promise<number> {
        let db = MongoContainer.getDB();
        let user = await db.user.findOne({_id});
        return user.age;
    }
}
```
UserController.ts
```javascript
import * as Express from 'express';
import * as Mongodb from 'mongodb';
import {RestController, Inject, Res, PathParam, Get} from 'mvc-ts';

import {UserService} from 'pathToUserService';

@RestController('/user')
export class UserController {
    @Inject()
    private userService: UserService;

    @Get('/:uid/age')
    public async getAgeAction(@PathParam('uid') uid: string, @Res() res: Express.Response) {
        let _id = Mongodb.ObjectID(uid);

        let age = await this.userService.getAge(_id);

        res.send(age);
    }

    @Get('/:uid/name')
    public async getNameAction(@PathParam('uid') uid: string, @Res() res: Express.Response) {
        let _id = Mongodb.ObjectID(uid);

        let name = await this.userService.getName(_id);

        res.send(name);
    }
}
```
now, you can get user name by url *http://127.0.0.1:3333/user/:uid/name*;
now, you can get user age by url *http://127.0.0.1:3333/user/:uid/age*;

# Redis
RedisService.ts
```javascript
import {Service, Redis} from 'mvc-ts';

@Service()
@Redis({name: 'code', prefix: 'code'})
export class SmsRedisService {
    private client: Reids.client;

    public async setCode(key, code) {
        return await this.client.set(key, code);
    }

    public async getCode(key) {
        return await this.client.get(key);
    }
}
```


[npm-image]: https://img.shields.io/npm/v/io-grpc.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/io-grpc