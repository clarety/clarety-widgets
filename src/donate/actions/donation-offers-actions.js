import { actionTypes } from './types';

export const setDonationOffers = donationOffers => ({
  type: actionTypes.setDonationOffers,
  payload: donationOffers,
});
