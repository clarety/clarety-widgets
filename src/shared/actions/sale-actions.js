import { types } from 'shared/actions';

export const addItem = ({ offerUid, offerPaymentUid, quantity = 1, price = undefined }) => ({
  type: types.addItem,
  item: {
    offerUid,
    offerPaymentUid,
    quantity,
    price: Number(price),
  },
});

export const clearItems = () => ({
  type: types.clearItems,
});

export const setPayment = payment => ({
  type: types.setPayment,
  payment,
});

export const clearPayment = () => ({
  type: types.clearPayment,
});
