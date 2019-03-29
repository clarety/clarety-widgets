import { actionTypes } from './types';

export const setSuggestedDonations = suggestedDonations => ({
  type: actionTypes.setSuggestedDonations,
  payload: suggestedDonations,
});
