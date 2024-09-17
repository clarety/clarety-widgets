import { Config } from 'shared/utils/config';
import { getEnv } from 'shared/utils/env';

export function getSitePath() {
  let devSitePath = Config.get('devSitePath');
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
