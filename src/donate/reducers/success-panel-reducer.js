import { actionTypes } from '../actions';

const initialState = {};

export const successPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setDonation:
      return {
        ...state,
        donation: action.donation,
      };

    default:
      return state;
  }
};
