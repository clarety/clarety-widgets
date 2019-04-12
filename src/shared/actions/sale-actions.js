import { actionTypes } from './types';

export const addSaleLine = ({ offerId, offerPaymentId, quantity = 1, amount = undefined }) => ({
  type: actionTypes.addSaleLine,
  saleLine: {
    offerId,
    offerPaymentId,
    quantity,
    amount: Number(amount),
  },
});

export const clearSaleLines = () => ({
  type: actionTypes.clearSaleLines,
});

export const setPayment = payment => ({
  type: actionTypes.setPayment,
  payment,
});

export const clearPayment = () => ({
  type: actionTypes.clearPayment,
});
