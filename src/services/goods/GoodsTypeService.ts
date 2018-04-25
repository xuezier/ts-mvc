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

  public async countTypesWithoutParent() {
    return await this.goodsType.getCollection().count({parent: {$exists: false}, status: 'active'});
  }

  public async getTypesWithoutParent(page: number, pagesize: number) {
    return await this.goodsType.getCollection().find({parent: {$exists: false}, status: 'active'}).skip(page * pagesize).limit(pagesize).toArray();
  }

  public async getGoodsTypeByPageAndPageSize(page: number, pagesize: number) {
    if (!pagesize) pagesize = 20;
    if (!page) page = 0;

    const total = await this.countTypesWithoutParent();
    const list = await this.getTypesWithoutParent(page, pagesize);

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