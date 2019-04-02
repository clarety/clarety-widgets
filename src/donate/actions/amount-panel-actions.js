import { actionTypes } from './types';

export const selectFrequency = frequency => ({
  type: actionTypes.selectFrequency,
  payload: frequency,
});

export const selectAmount = (frequency, amount, isVariableAmount = false) => ({
  type: actionTypes.selectAmount,
  payload: { frequency, amount, isVariableAmount },
});

export const selectDefaults = donationOffers => ({
  type: actionTypes.selectDefaults,
  payload: donationOffers,
});
