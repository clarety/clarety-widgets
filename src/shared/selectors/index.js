import { getEnv } from 'clarety-utils';

export const getAuth = (state) => state.auth;
export const getCart = (state) => state.cart;
export const getSettings = (state) => state.settings;

export const getIsLoggedIn = (state) => !!getAuth(state).jwt;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getIsCartComplete = (state) => getCart(state).status === 'Complete';

export const getClientId = (state) => {
  const env = getEnv();

  if (env === 'dev') {
    return getSetting(state, 'devClientId');
  }

  return getSetting(state, 'prodClientId');
}
