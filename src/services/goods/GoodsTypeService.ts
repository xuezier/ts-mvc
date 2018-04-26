import * as Mongodb from 'mongodb';

import {Service, Inject} from 'mvc';
import { GoodsType } from '../../model/goods/Type';
import { DefinedError } from '../../model/DefinedError';

@Service()
export class GoodsTypeService {

  @Inject()
  private goodsType: GoodsType;

  public async createType(type: GoodsType) {
    const name = type.name;

    const exists = await this.findGoodsTypeByName(name);
    if (exists) throw new DefinedError(400, 'type_name_exists');

    const result = await this.goodsType.getCollection().insertOne(type);
    type._id = result.insertedId;
    return type;
  }

  public async findGoodsTypeByName(name: string) {
    return await this.goodsType.getCollection().findOne({name});
  }

  public async findGoodsTypeById(_id: Mongodb.ObjectID) {
    return await this.goodsType.getCollection().findOne({_id});
  }

  public async getTypesWithParent(parent: Mongodb.ObjectID): GoodsType[] {
    return await this.goodsType.getCollection().find({parent, status: 'active'}).toArray();
  }

  public async countTypesWithParent(parent: Mongodb.ObjectID) {
    return await this.goodsType.getCollection().count({parent, status: 'active'});
  }

  public async getGoodsTypeWithParent(parent: Mongodb.ObjectID) {
    const total = await this.countTypesWithParent(parent);
    const list = await this.getTypesWithParent(parent);

    return {
      list,
      nums: list.length,
      total
    };
  }

  public async countTypesWithoutParent() {
    return await this.goodsType.getCollection().count({parent: {$exists: false}, status: 'active'});
  }

  public async getTypesWithoutParent(): Array {
    return await this.goodsType.getCollection().find({parent: {$exists: false}, status: 'active'}).toArray();
  }

  public async getGoodsTypeWithoutParent() {
    const total = await this.countTypesWithoutParent();
    const list = await this.getTypesWithoutParent();

    return {
      list,
      nums: list.length,
      total
    };
  }

  private async _modifyType(_id: Mongodb.ObjectID, modify: GoodsType) {
    const result = await this.goodsType.getCollection().findOneAndUpdate({_id}, {$set: modify}, {upsert: false, returnOriginal: false});
    return result.value;
  }

  public async modifyType(_id: MongodbObjectID, info: GoodsType) {
    return await this._modifyType(_id, info);
  }
}