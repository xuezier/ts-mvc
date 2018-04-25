import * as Mongodb from 'mongodb';
import * as SchemaObject from 'schema-object';
import * as _ from 'lodash';

import {Model, Collection} from 'mvc';
import { DefinedError } from './DefinedError';

@Collection('user.shipping.address')
@Model()
export class UserShippingAddress {
  _id: Mongodb.ObjectID;
  user: Mongodb.ObjectID;
  receiver: string;
  address: {
    zip: string;
    province: string;
    city: string;
    county: string;
    town: string;
    street: string;
    mark: string;
  };
  mobile: string;
  email: string;
  telephone: string;
  create_at: Date;
}

export const UserShippingAddressSchema = new SchemaObject({
  receiver: {type: String, minLength: 1, required: true},
  address: new SchemaObject({
    zip: String,
    province: {type: String, minLength: 1, required: true},
    city: {type: String, minLength: 1, required: true},
    county: {type: String, minLength: 1, required: true},
    town: {type: String},
    street: {type: String, minLength: 1, required: true},
    mark: {type: String}
  }),
  mobile: {type:String, minLength: 11, required: true},
  email: String,
  telephone: String,
  create_at: {type: Date, default: () => new Date}
});

export function schema(info: UserShippingAddress): UserShippingAddress {
  const address = new UserShippingAddressSchema(info);
  const errors = address.getErrors();
  if(!_.isEmpty(errors)) {
    throw new DefinedError(400, `invalid_value_${errors[0].fieldSchema.name}`, errors[0].errorMessage);
  }
  return address.toObject();
}