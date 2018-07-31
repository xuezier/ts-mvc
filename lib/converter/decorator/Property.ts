import {PropertyRegistry} from '../PropertyRegistry';
import {PropertyOptions} from '../PropertyOptions';

export function Property(nameOrOptions?: string) {

  return (target: any, propertyName: string) => {

    PropertyRegistry.registerObjectProperty(target.constructor, propertyName, nameOrOptions);

  };

}