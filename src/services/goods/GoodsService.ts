import * as Mongodb from 'mongodb';

import {Service, Inject} from 'mvc';
import { GoodsModel } from '../../model';

@Service()
export class GoodsService {
  @Inject()
  private goods: GoodsModel;

  public async findGoodsById(_id: Mongodb.ObjectID) {
    return await this.goods.getCollection().findOne({_id});
  }

}