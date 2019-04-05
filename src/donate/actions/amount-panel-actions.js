import { actionTypes } from './types';

export const selectFrequency = frequency => ({
  type: actionTypes.selectFrequency,
  frequency,
});

export const selectAmount = (frequency, amount, isVariableAmount = false) => ({
  type: actionTypes.selectAmount,
  frequency,
  amount,
  isVariableAmount,
});

export const selectDefaults = donationOffers => ({
  type: actionTypes.selectDefaults,
  donationOffers,
});
