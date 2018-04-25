import * as Mongodb from 'mongodb';

import {Service, Inject} from 'mvc';
import { UserShippingAddress } from '../model/UserShippingAddress';
import { DefinedError } from '../model/DefinedError';

@Service()
export class UserShippingAddressService {
  @Inject()
  private shippingAddress: UserShippingAddress;

  public async createAddress(address: UserShippingAddress) {
    const userAddressTotal = await this.countUserAddress(address.user);

    if(userAddressTotal < 10) {
      const insertResult = await this.shippingAddress.getCollection().insertOne(address);

      address._id = insertResult.insertedId;
      return address;
    } else {
      throw new DefinedError(400, 'too_many_shippingAddress');
    }
  }

  public async countUserAddress(user: Mongodb.ObjectID) {
    return await this.shippingAddress.getCollection().count({user});
  }

  public async getUserAddresses(user: Mongodb.ObjectID) {
    return await this.shippingAddress.getCollection().find({user}).toArray();
  }

  public async findAddressById(_id: Mongodb.ObjectID) {
    return await this.shippingAddress.getCollection().findOne({_id});
  }

  private async _modifyAddress(_id: Mongodb.ObjectID, modify: UserShippingAddress) {
    const result = await this.shippingAddress.getCollection().findOneAndUpdate({_id}, {$set: modify}, {upsert: false, returnOriginal: false});
    return result.value;
  }

  public async modifyAddress(_id, info: UserShippingAddress) {
    return await this._modifyAddress(_id, info);
  }

  public async deleteAddressByIdWithUser(_id: Mongodb.ObjectID, user: Mongodb.ObjectID) {
    return await this.shippingAddress.getCollection().remove({_id, user});
  }
}