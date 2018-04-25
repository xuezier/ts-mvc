import * as SchemaObject from 'schema-object';
import * as _ from 'lodash';
import { DefinedError } from '../model/DefinedError';

export function ModelSchema(schema: SchemaObject) {
  return function (target: Function) {
    target.prototype.schema = function(info: any) {
      const o = new schema(info);
      const errors = o.getErrors();
      if(!_.isEmpty(errors)) {
        throw new DefinedError(400, `invalid_value_${errors[0].fieldSchema.name}`, errors[0].errorMessage);
      }
      return o.toObject();
    }
  }
}