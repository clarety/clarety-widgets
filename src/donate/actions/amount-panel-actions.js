import { actionTypes } from './types';

export const selectFrequency = frequency => ({
  type: actionTypes.selectFrequency,
  payload: frequency,
});

export const selectAmount = (frequency, index, amount, variableAmount = null) => ({
  type: actionTypes.selectAmount,
  payload: { frequency, index, amount, variableAmount },
});
