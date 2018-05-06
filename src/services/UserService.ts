import * as Mongodb from 'mongodb';

import {Service, MongoContainer, Inject} from 'mvc';

import {User} from '../model/User';

import * as Util from '../utils/util';

@Service()
export class UserService {

  @Inject()
  private user: User;

  private db = MongoContainer.getDB();

  public async createUser(info: {
    email: string,
    mobile: string,
    password: string,
  }) {
    const user = new User();

    const {
      password,
      mobile,
      email
    } = info;
    if (password.length < 6) {
      throw new Error('invalid_password_length');
    } else if (mobile) {
      if (!Util.testMobile(mobile)) {
        throw new Error('invalid_mobile');
      }
      user.mobile = mobile;
    } else {
      if (!Util.testEmail(email)) {
        throw new Error('invalid_email');
      }
      user.email = email;
    }

    const pass = Util.saltMd5(info.password);
    user.password = pass;

    user.create_at = new Date;
    // console.log(user);
    const insertResult = await this.user.getCollection().insertOne(user);
    user._id = insertResult.insertedId;
    return user;
  }

  public async findByMobile(mobile: string): User {
    const user: User = await this.user.getCollection().findOne({mobile});

    return user;
  }

  public async findByEmail(email: string): User {
    const user: User = await this.user.getCollection().findOne({email});

    return user;
  }

  public async findById(_id: string): User {
    try {
      const user: User = await this.user.getCollection().findOne({_id: Mongodb.ObjectID(_id)});
      return user;
    } catch (e) {
      throw e;
    }
  }

  public async findByIdWithoutPassword(_id: Mongodb.ObjectID): User {
    return await this.user.getCollection().findOne({_id}, {password: 0});
  }

  private async _modify(_id: Mongodb.ObjectID, info: User) {
    const result = await this.user.getCollection().findOneAndUpdate({_id}, {$set: info}, {
      returnOriginal: false,
      upsert: false
    });

    const user: User = result.value;
    delete user.password;
    return user;
  }

  public async modify(_id: Mongodb.ObjectID, info: User) {
    return await this._modify(_id, info);
  }
}