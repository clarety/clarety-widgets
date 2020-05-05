export class Resources {
  _components = {};
  _connects = {};

  getComponent(name) {
    return this._components[name];
  }

  setComponent(name, component) {
    this._components[name] = component;
  }

  getConnect(name) {
    return this._connects[name];
  }

  setConnect(name, connect) {
    this._connects[name] = connect;
  }

  setPanels(panels) {
    for (const panel of panels) {
      this.setComponent(panel.component.name, panel.component);

      if (panel.connect) {
        this.setConnect(panel.connect.name, panel.connect);
      }
    }
  }
}
