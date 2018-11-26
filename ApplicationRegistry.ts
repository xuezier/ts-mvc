import {SettingOptions} from './SettingOptions';
import {DependencyRegistry} from './lib/di/DependencyRegistry';
import {Klass} from './lib/core/Klass';

export class ApplicationRegistry {

  public static settings: SettingOptions;

  public static registerWithOptions(target: Function, options: SettingOptions) {
    DependencyRegistry.registerComponent(target as Klass);
    this.settings = options;
  }
}
