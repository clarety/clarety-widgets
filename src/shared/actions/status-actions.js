import { types } from 'shared/actions';

export const statuses = {
  initializing: 'initializing',
  ready: 'ready',
  busy: 'busy',

  // Checkout
  busyPromoCode: 'busy-promo-code',

  // Registrations
  validating: 'validating',
  submitting: 'submitting',
};

export const setStatus = status => ({
  type: types.setStatus,
  status,
});
