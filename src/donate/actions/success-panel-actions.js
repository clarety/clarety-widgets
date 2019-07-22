import { types } from 'donate/actions';

export const setSuccessResult = result => ({
  type: types.setSuccessResult,
  result,
});
