import { types } from 'donate/actions';

export const selectFrequency = frequency => ({
  type: types.selectFrequency,
  frequency,
});

export const selectAmount = (frequency, amount, isVariableAmount = false) => ({
  type: types.selectAmount,
  frequency,
  amount,
  isVariableAmount,
});
