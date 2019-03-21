import actionTypes from './types';

export const formStatuses = {
  uninitialized: 'uninitialized',
  ready: 'ready',
  busy: 'busy',
};

export const setFormStatus = state => ({
  type: actionTypes.setFormStatus,
  payload: state,
});
