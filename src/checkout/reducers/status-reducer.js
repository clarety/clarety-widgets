import { statuses } from 'shared/actions';
import { types } from 'checkout/actions';

const initialState = statuses.ready;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.hasAccountRequest:
    case types.loginRequest:
    case types.fetchCustomerRequest:
      return statuses.busy;

    case types.hasAccountSuccess:
    case types.hasAccountFailure:
    case types.loginSuccess:
    case types.loginFailure:
    case types.fetchCustomerSuccess:
    case types.fetchCustomerFailure:
      return statuses.ready;

    default:
      return state;
  }
};
