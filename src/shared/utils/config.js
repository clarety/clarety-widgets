let _config = null;

export class Config {
  static init(config) {
    _config = config;
  }

  static get(key) {
    return _config[key];
  }
}
