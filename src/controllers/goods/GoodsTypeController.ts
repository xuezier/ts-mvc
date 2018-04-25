import * as Express from 'express';
import * as Mongodb from 'Mongodb';

import {RestController, Post, Get, Put, Delete, Req, Res, Data, Next, QueryParam, PathParam, Inject} from 'mvc';
import { GoodsType } from '../../model/goods/Type';
import { GoodsTypeService } from '../../services';
import { DefinedError } from '../../model/DefinedError';

@RestController('/api/goods/type')
export class GoodsTypeController {

  @Inject()
  private goodsType: GoodsType;

  @Inject()
  private goodsTypeService: GoodsTypeService;

  @Post('/')
  public async createAction(@Req() req: Express.Request, @Res() res: Express.Response) {
    const body = req.body;
    const info = this.goodsType.schema(body);

    const type: GoodsType = await this.goodsTypeService.createType(info);

    res.sendJson(type);
  }

  @Get('/')
  public async getTypeListAction(@QueryParam('page') page: number, @QueryParam('pagesize') pagesize: number, @Res() res: Express.Response) {
    const result = await this.goodsTypeService.getGoodsTypeByPageAndPageSize(page, pagesize);

    res.sendJson(result);
  }


  @Put('/:_id')
  public async modifyTypeAction(@PathParam('_id') _id: string, @Req() req: Express.Request, @Res() res: Express.Response) {
    _id = Mongodb.ObjectID(_id);

    let type: GoodsType = await this.goodsTypeService.findGoodsTypeById(_id);
    if (!type) throw new DefinedError(400, 'not_found_type');

    Object.assign(type, req.body);
    const modify = this.goodsType.schema(type);

    const result: GoodsType = await this.goodsTypeService.modifyType(_id, modify);
    res.sendJson(result);
  }

  @Delete('/:_id')
  public async deleteTypeAction(@PathParam('_id') _id: string, @Res() res: Express.Response) {
    _id = Mongodb.ObjectID(_id);

    let type: GoodsType = await this.goodsTypeService.findGoodsTypeById(_id);
    if (!type) throw new DefinedError(400, 'not_found_type');
    type.status = 'disabled';

    const result = await this.goodsTypeService.modifyType(_id, type);

    res.sendJson(result);
  }
}
