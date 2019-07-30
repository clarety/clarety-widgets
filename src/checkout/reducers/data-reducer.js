import { types } from 'checkout/actions';

const initialState = {
  contactDetails: null,
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setContactDetails:
      return {
        ...state,
        contactDetails: action.data,
      };

    default:
      return state;
  }
};
