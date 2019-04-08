import { actionTypes } from './types';

export const setDonation = donation => ({
  type: actionTypes.setDonation,
  donation,
});
