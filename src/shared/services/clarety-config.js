class ClaretyConfig {
  static _config = null;

  static init(config) {
    this._config = config;
  }

  static get(key) {
    return this._config[key];
  }

  static env() {
    const url = window.location.href;
    if (url.startsWith('http://localhost')) return 'dev';
    if (url.startsWith('http://dev-'))      return 'dev';
    if (url.startsWith('https://test-'))    return 'test';
    if (url.startsWith('https://stage-'))   return 'stage';
  
    return 'prod';
  };

  
}

export default ClaretyConfig;
