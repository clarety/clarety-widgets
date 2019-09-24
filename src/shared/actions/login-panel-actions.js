import { types } from 'shared/actions';

export const emailStatuses = {
  notChecked: 'not-checked',
  noAccount:  'no-account',
  hasAccount: 'has-account',
};

export const setEmailStatus = emailStatus => ({
  type: types.setEmailStatus,
  emailStatus: emailStatus,
});

export const resetEmailStatus = () => ({
  type: types.resetEmailStatus,
});
