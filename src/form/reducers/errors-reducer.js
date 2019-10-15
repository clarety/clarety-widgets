import { types as sharedTypes } from 'shared/actions';
import { types } from 'form/actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setErrors:
      return action.errors;

    case types.clearErrors:
      return [];

    case sharedTypes.loginFailure:
      return [{
        field: 'password',
        message: action.result.error_description,
      }];

    default:
      return state;
  }
};
