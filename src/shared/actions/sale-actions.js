import { types } from 'shared/actions';

export const addSaleline = ({ offerUid, offerPaymentUid, quantity = 1, price = undefined }) => ({
  type: types.addSaleline,
  saleline: {
    offerUid,
    offerPaymentUid,
    quantity,
    price: Number(price),
  },
});

export const clearSalelines = () => ({
  type: types.clearSalelines,
});

export const setPayment = payment => ({
  type: types.setPayment,
  payment,
});

export const clearPayment = () => ({
  type: types.clearPayment,
});
