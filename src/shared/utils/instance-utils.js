import { Config, getEnv } from 'clarety-utils';

export function getAssetsPath() {
  const devAssetsPath = Config.get('devAssetsPath');
  if (!devAssetsPath) throw new Error('[Clarety] "devAssetsPath" not set in config.');

  return getEnv() === 'prod' ? '' : devAssetsPath;
}

export function loadCss(cssPath) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;

  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}
