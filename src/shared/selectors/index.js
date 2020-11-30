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
export const getTranslations = (state) => state.translations;

export const getIsLoggedIn = (state) => !!getAuth(state).jwt;

export const getSetting = (state, setting) => getSettings(state)[setting];

export const getIsResumed = (state) => getSetting(state, 'isResumed');
export const getVariant = (state) => getSetting(state, 'variant');

export const getElement = (state, property) => {
  const elements = getSetting(state, 'elements');
  if (!elements) return null;

  return elements.find(element => element.property === property);
};

export const getIsCartComplete = (state) => getCart(state).status === 'Complete';

export const getCartShippingRequired = (state) => getCart(state).shippingRequired;

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

export const getCurrency = (state) => {
  if (state.cart && state.cart.currency) {
    return state.cart.currency;
  }

  if (state.settings && state.settings.currency) {
    return state.settings.currency;
  }

  return { symbol: '$', code: undefined };
};

export const getSourceOptions = (state) => {
  const element = getElement(state, 'sourceId');
  return element ? element.options : undefined;
};

export const getLanguages = (state) => getTranslations(state).languages;

export const getSelectedLanguage = (state) => getTranslations(state).selectedLanguage;

export const getIsEditingFirstPanel = (state) => {
  const panels = getPanelManager(state);
  return panels[0].status === 'edit';
};

export const getSalutationOptions = (state) => {
  // Try to load from settings.
  const setting = getSetting(state, 'salutationOptions');
  if (setting) return setting;

  // Try to load from elements.
  const element = getElement(state, 'salutation');
  if (element) return element.options;

  // Fallback to default.
  return [
    { value: 'mr',   label: 'Mr' },
    { value: 'mrs',  label: 'Mrs' },
    { value: 'miss', label: 'Miss' },
    { value: 'ms',   label: 'Ms' },
  ];
};
