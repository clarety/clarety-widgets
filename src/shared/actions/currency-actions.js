import { actionTypes } from './types';

export const setCurrency = currency => ({
  type: actionTypes.setCurrency,
  currency,
});
