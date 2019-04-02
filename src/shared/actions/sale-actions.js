import { actionTypes } from './types';

export const addToSale = ({ offerId, offerPaymentId, qty, amount }) => ({
  type: actionTypes.addToSale,
  payload: { offerId, offerPaymentId, qty, amount },
});

export const clearSale = () => ({
  type: actionTypes.clearSale,
});
