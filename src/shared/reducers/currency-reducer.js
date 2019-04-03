import { actionTypes } from '../actions';

const initialState = {
  symbol: '',
  code: '',
};

export const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setCurrency:
      return action.payload;

    default:
      return state;
  }
};
