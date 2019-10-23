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

  static setPanels(panels) {
    for (const panel of panels) {
      this.setComponent(panel.component.name, panel.component);

      if (panel.connect) {
        this.setConnect(panel.connect.name, panel.connect);
      }
    }
  }
}
