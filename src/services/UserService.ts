import * as Mongodb from 'mongodb';

import {Service, MongoContainer, Inject} from 'mvc';

import {User} from '../model/User';

@Service()
export class UserService {

  @Inject()
  private user : User;

  private db = MongoContainer.getDB();

  public async findById(_id: string): User {
    try {
      const user: User = await this.user.collection.findOne({_id: Mongodb.ObjectID(_id)});
      return user;
    } catch(e) {
      throw e;
    }
  }
}