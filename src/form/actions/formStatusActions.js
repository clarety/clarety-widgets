import actionTypes from './types';

export const statuses = {
  uninitialized: 'uninitialized',
  ready: 'ready',
  busy: 'busy',
};

export const setStatus = state => ({
  type: actionTypes.setFormStatus,
  payload: state,
});
