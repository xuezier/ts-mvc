import * as Express from 'express';
import * as Mongodb from 'mongodb';

import {RestController, Post, Get, Put, Delete, Res, Req, BodyParam, PathParam, Inject} from 'mvc';
import { UserShippingAddress, schema } from '../../model/UserShippingAddress';
import { User } from '../../model';
import { UserShippingAddressService } from '../../services/UserShippingAddressService';
import { DefinedError } from '../../model/DefinedError';

@RestController('/api/user/shipping/address')
export class UserShippingAddressController {

  @Inject()
  private shippingService: UserShippingAddressService;

  @Inject()
  private shippingAddress: UserShippingAddress;

  @Post('/')
  public async createAddressAction(@Req() req: Express.Resquest, @Res() res: Express.Response) {
    const body: UserShippingAddress = req.body;

    const address = this.shippingAddress.schema(body);
    const user: User = req.user;
    address.user = user._id;

    const result = await this.shippingService.createAddress(address);
    res.sendJson(address);
  }

  @Get('/')
  public async getUserAddressAction(@Req() req: Express.Resquest, @Res() res: Express.Response) {
    const user: User = req.user;

    const addresses: UserShippingAddress[] = await this.shippingService.getUserAddresses(user._id);

    res.sendJson(addresses);
  }

  @Put('/:addressId')
  public async modifyAddressAction(@PathParam('addressId') addressId: string, @Req() req: Express.Resquest, @Res() res: Express.Response) {

    addressId = Mongodb.ObjectID(addressId);

    const address: UserShippingAddress = await this.shippingService.findAddressById(addressId);

    if(!address) {
      throw new DefinedError(404, 'address_not_found');
    }
    Object.assign(address, req.body);
    const modify: UserShippingAddress = this.shippingAddress.schema(address);
    const result = await this.shippingService.modifyAddress(addressId, modify);
    res.sendJson(result);
  }

  @Delete('/:addressId')
  public async deleteAddressAction(@PathParam('addressId') addressId: string, @Req() req: Express.Resquest, @Res() res: Express.Response) {
    addressId = Mongodb.ObjectID(addressId);

    const user: User = req.user;

    const result = await this.shippingService.deleteAddressByIdWithUser(addressId, user._id);

    res.sendJson(result);
  }
}