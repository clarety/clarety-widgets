import { actionTypes } from './types';

export const addToSale = ({ offerId, offerPaymentId, qty, amount }) => ({
  type: actionTypes.addToSale,
  saleLine: {
    offerId,
    offerPaymentId,
    qty,
    amount,
  },
});

export const clearSale = () => ({
  type: actionTypes.clearSale,
});
