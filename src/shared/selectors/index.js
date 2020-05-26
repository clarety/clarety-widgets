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
  // TODO:::::: where do these come from??

  return [
    { value: '293', label: 'Propel' },
    { value: '295', label: 'Can You See Me' },
    { value: '209', label: 'Book' },
    { value: '9',   label: 'Event' },
    { value: '7',   label: 'Church' },
    { value: '5',   label: 'Google Search' },
    { value: '1',   label: 'Friend' },
    { value: '267', label: 'Walk for Freedom' },
    { value: '17',  label: 'Instagram' },
    { value: '19',  label: 'Twitter' },
    { value: '2',   label: 'Facebook' },
    { value: '3',   label: 'YouTube' },
    { value: '163', label: 'TBN' },
  ];
};

export const getSourceQuestions = (state) => {
  // TODO:::::: where do these come from??

  return {
    '7':   { question: 'What is the name of your church?', isRequired: true },
    '209': { question: 'What is the name of the book?',    isRequired: false },
    '9':   { question: 'What was the name of the event?',  isRequired: true },
  };
};
