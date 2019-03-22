class ClaretyConfig {
  static _config = null;

  static init = (config) => {
    this._config = config;
  }

  static get = (key) => {
    return this._config[key];
  }
}

export default ClaretyConfig;
