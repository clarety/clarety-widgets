import { types } from 'checkout/actions';

const initialState = {
  contactDetails: null,
  personalDetails: null,
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

    default:
      return state;
  }
};
