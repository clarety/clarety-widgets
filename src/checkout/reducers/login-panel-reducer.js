import { types as sharedTypes } from 'shared/actions';
import { types, emailStatuses } from 'checkout/actions';

const initialState = {
  emailStatus: emailStatuses.notChecked,
};

export const loginPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setEmailStatus:
      return {
        ...state,
        emailStatus: action.emailStatus,
      };

    case types.resetEmailStatus:
    case sharedTypes.logoutSuccess:
      return {
        ...state,
        emailStatus: emailStatuses.notChecked,
      };

    default:
      return state;
  }
};
