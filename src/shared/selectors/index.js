import { getEnv } from 'clarety-utils';
import { parseNestedElements } from 'shared/utils';

export const getAuth = (state) => state.auth;
export const getCart = (state) => state.cart;
export const getSettings = (state) => state.settings;
export const getFormData = (state) => state.formData;
export const getErrors = (state) => state.errors;

export const getIsLoggedIn = (state) => !!getAuth(state).jwt;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getIsCartComplete = (state) => getCart(state).status === 'Complete';

export const getOrganisation = (state) => getCart(state).organisation;

export const getClientId = (state) => {
  const env = getEnv();

  if (env === 'dev') {
    return getSetting(state, 'devClientId');
  }

  return getSetting(state, 'prodClientId');
}

export const getParsedFormData = (state) => {
  const formData = getFormData(state);
  return parseNestedElements(formData);
};

export const getTrackingData = (state) => getCart(state).tracking;

export const getRecaptcha = (state) => getCart(state).recaptcha;
