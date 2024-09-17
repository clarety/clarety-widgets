export function getEnv() {
  const url = window.location.hostname;

  if (url.startsWith('localhost')) return 'dev';
  if (url.includes('.dev.'))       return 'dev';
  if (url.includes('.dev-'))       return 'dev';
  if (url.startsWith('dev-'))      return 'dev';
  
  if (url.startsWith('stage-'))    return 'stage';
  if (url.startsWith('test-'))     return 'test';

  return 'prod';
}

export function getDevHost() {
  const url = window.location.hostname;
  const match = url.match(/dev-([^.]+)/);
  return match && match[1] || undefined;
}
