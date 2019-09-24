import { types } from 'shared/actions';

export const setLoginPanelMode = mode => ({
  type: types.setLoginPanelMode,
  mode: mode,
});
