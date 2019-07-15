let _config = null;

export class ClaretyConfig {
  static init = config => {
    _config = config;
  }

  static get = key => {
    return _config[key];
  }

  static env = () => {
    const url = window.location.href;
    if (url.startsWith('http://localhost')) return 'dev';
    if (url.startsWith('http://dev-'))      return 'dev';
    if (url.startsWith('https://test-'))    return 'test';
    if (url.startsWith('https://stage-'))   return 'stage';
  
    return 'prod';
  }  
}
