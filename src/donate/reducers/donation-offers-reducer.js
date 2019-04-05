import { actionTypes } from '../actions';

const initialState = {};

export const donationOffersReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setDonationOffers:
      return action.donationOffers;

    default:
      return state;
  }
};
