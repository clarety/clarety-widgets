import { getEnv } from 'clarety-utils';

export const getSettings = (state) => state.settings;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getClientId = (state) => {
  const env = getEnv();

  if (env === 'dev') {
    return getSetting(state, 'devClientId');
  }

  return getSetting(state, 'prodClientId');
}
