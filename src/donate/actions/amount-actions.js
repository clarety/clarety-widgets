import { types } from 'donate/actions';

export const selectFrequency = frequency => ({
  type: types.selectFrequency,
  frequency: frequency,
});

export const selectAmount = (frequency, amount, isVariableAmount = false) => ({
  type: types.selectAmount,
  frequency: frequency,
  amount: amount,
  isVariableAmount: isVariableAmount,
});

export const selectDefaults = offers => ({
  type: types.selectDefaults,
  offers: offers,
});

export const handleUrlParams = () => {
  return async (dispatch, getState) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const amount = Number(urlParams.get('amount'));
    if (amount) dispatch(selectAmount('single', amount, true));
  };
};
