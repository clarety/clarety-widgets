import { types } from 'registrations/actions';

const initialState = {
  errors: null,
  sale: null,
};

export const registrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.registrationCreateSuccess:
      return {
        errors: null,
        sale: action.result,
      };

    case types.registrationCreateFailure:
      return {
        errors: action.result.validationErrors,
        sale: null,
      };

    default:
      return state;
  }
};
