import { types } from 'shared/actions';

export const statuses = {
  uninitialized: 'uninitialized',
  ready: 'ready',
  busy: 'busy',

  // Checkout
  busyPromoCode: 'busy-promo-code',
};

export const setStatus = status => ({
  type: types.setStatus,
  status,
});
