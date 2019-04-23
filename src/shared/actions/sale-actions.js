import { actionTypes } from './types';

export const addSaleLine = ({ offerUid, offerPaymentUid, quantity = 1, price = undefined }) => ({
  type: actionTypes.addSaleLine,
  saleLine: {
    offerUid,
    offerPaymentUid,
    quantity,
    price: Number(price),
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
