import { actionTypes } from './types';

export const addSaleLine = ({ offerId, offerPaymentId, quantity = 1, amount = undefined }) => ({
  type: actionTypes.addSaleLine,
  saleLine: {
    offerId,
    offerPaymentId,
    quantity,
    amount,
  },
});

export const clearSaleLines = () => ({
  type: actionTypes.clearSaleLines,
});
