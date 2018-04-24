export class ApplicationContainer {
  private static models: Map<string, any> = new Map();
  private static configs: Map<string, object> = new Map();

  public static setModel(name: string, model: any) {
    this.models.set(name, model instanceof Function ? model() : model);
  }

  public static getModel(name: string) {
    return this.models.get(name);
  }

  public static setConfig(name: string, config: object) {
    this.configs.set(name, config);
  }

  public static getConfig(name: string) {
    return this.configs.get(name);
  }
}