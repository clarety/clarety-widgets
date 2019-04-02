import { actionTypes } from '../actions';

const initialState = {};

const donationOffersReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setDonationOffers:
      return action.payload;

    default:
      return state;
  }
};

export default donationOffersReducer;
