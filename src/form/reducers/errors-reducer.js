import { t } from 'shared/translations';
import { types as sharedTypes } from 'shared/actions';
import { types } from 'form/actions';

const initialState = [];

export const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setErrors:
      return action.errors;

    case types.clearErrors:
      return [];

    case types.updateFormData:
      return state.filter(error => error.field !== action.field);

    case sharedTypes.loginFailure:
      const message = action.result.error_description;

      return [{
        field: 'password',
        message: t(message, message),
      }];

    default:
      return state;
  }
};
