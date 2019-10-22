export class Resources {
  static _components = {};
  static _connects = {};

  static getComponent(name) {
    return this._components[name];
  }

  static setComponent(name, component) {
    this._components[name] = component;
  }

  static getConnect(name) {
    return this._connects[name];
  }

  static setConnect(name, connect) {
    this._connects[name] = connect;
  }
}
