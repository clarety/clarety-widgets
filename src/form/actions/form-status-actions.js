import { actionTypes } from './types';

export const statuses = {
  uninitialized: 'uninitialized',
  ready: 'ready',
  busy: 'busy',
};

export const setStatus = status => ({
  type: actionTypes.setFormStatus,
  status,
});
