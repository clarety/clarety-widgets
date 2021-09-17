import { Config, getEnv } from 'clarety-utils';

// Deprecated
// TODO: remove once no-one is using...
export function getAssetsPath() {
  return getSitePath();
}

export function getSitePath() {
  let devSitePath = Config.get('devSitePath');

  // TODO: remove once no-one is using 'devAssetsPath'.
  if (!devSitePath) devSitePath = Config.get('devAssetsPath');

  if (!devSitePath) throw new Error('[Clarety] "devSitePath" not set in config.');

  return getEnv() === 'prod' ? '' : devSitePath;
}

export function getPath(path) {
  return getSitePath() + '/' + path;
}

export function loadCss(cssPath) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;

  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}
