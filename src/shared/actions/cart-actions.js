import { actionTypes } from './types';

export const addToCart = ({ offerId, offerPaymentId, qty, amount }) => ({
  type: actionTypes.addToCart,
  payload: { offerId, offerPaymentId, qty, amount },
});

export const clearCart = () => ({
  type: actionTypes.clearCart,
});
