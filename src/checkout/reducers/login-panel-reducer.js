import { types as sharedTypes } from 'shared/actions';
import { types, emailStatuses } from 'checkout/actions';

const initialState = {
  emailStatus: emailStatuses.notChecked,
};

export const loginPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.resetEmailStatus:    return resetEmailStatus(state, action);

    case types.hasAccountRequest:   return resetEmailStatus(state, action);
    case types.hasAccountSuccess:   return hasAccountSuccess(state, action);
    case sharedTypes.logoutSuccess: return resetEmailStatus(state, action);

    default:
      return state;
  }
};

function hasAccountSuccess(state, action) {
  return {
    ...state,
    emailStatus: action.result.exists ? emailStatuses.hasAccount : emailStatuses.noAccount,
  };
}

function resetEmailStatus(state, action) {
  return {
    ...state,
    emailStatus: emailStatuses.notChecked,
  };
}
