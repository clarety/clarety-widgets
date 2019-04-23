import { actionTypes } from './types';

export const addSaleline = ({ offerUid, offerPaymentUid, quantity = 1, price = undefined }) => ({
  type: actionTypes.addSaleline,
  saleline: {
    offerUid,
    offerPaymentUid,
    quantity,
    price: Number(price),
  },
});

export const clearSalelines = () => ({
  type: actionTypes.clearSalelines,
});

export const setPayment = payment => ({
  type: actionTypes.setPayment,
  payment,
});

export const clearPayment = () => ({
  type: actionTypes.clearPayment,
});
