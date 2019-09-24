import { types, emailStatuses } from 'shared/actions';

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
    case types.logoutSuccess:
      return {
        ...state,
        emailStatus: emailStatuses.notChecked,
      };

    default:
      return state;
  }
};
