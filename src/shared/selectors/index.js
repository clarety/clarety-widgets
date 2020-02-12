import { getEnv } from 'clarety-utils';
import { statuses } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';

export const getAuth = (state) => state.auth;
export const getStatus = (state) => state.status;
export const getCart = (state) => state.cart;
export const getSettings = (state) => state.settings;
export const getFormData = (state) => state.formData;
export const getIsBusy = (state) => state.status !== statuses.ready;
export const getErrors = (state) => state.errors;
export const getPanelManager = (state) => state.panelManager;

export const getIsLoggedIn = (state) => !!getAuth(state).jwt;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getIsResumed = (state) => getSetting(state, 'isResumed');
export const getVariant = (state) => getSetting(state, 'variant');

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

export const getPromoCode = (state) => getCart(state).promoCode;

export const getTrackingData = (state) => getCart(state).tracking;

export const getRecaptcha = (state) => getCart(state).recaptcha;
