import { types } from 'shared/actions';

const modes = {
  checkEmail:    'check-email',
  noAccount:     'no-account',
  createAccount: 'create-account',
  login:         'login',
  loggedIn:      'logged-in',
};

const initialState = {
  mode: modes.checkEmail,
};

export const loginPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setLoginPanelMode:
      return {
        ...state,
        mode: action.mode,
      };

    case types.logoutSuccess:
      return {
        ...state,
        mode: modes.checkEmail,
      };

    default:
      return state;
  }
};
