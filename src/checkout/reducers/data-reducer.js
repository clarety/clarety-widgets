import { types } from 'checkout/actions';

const initialState = {
  contactDetails: null,
  personalDetails: null,
  shippingDetails: null,
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setContactDetails:
      return {
        ...state,
        contactDetails: action.data,
      };

    case types.setPersonalDetails:
      return {
        ...state,
        personalDetails: action.data,
      };

    case types.setShippingDetails:
      return {
        ...state,
        shippingDetails: action.data,
      };

    default:
      return state;
  }
};
