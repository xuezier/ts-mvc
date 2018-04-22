export class ApplicationContainer {
  private static models: Map<string, any> = new Map();

  public static setModel(name: string, model: any) {
    this.models.set(name, model instanceof Function ? model() : model);
  }

  public static getModel(name: string) {
    return this.models.get(name);
  }
}