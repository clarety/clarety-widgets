import { updateItem } from 'shared/actions';
import { getCart } from 'shared/selectors';

export const adjustDonation = (amount) => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    const index = cart.items.findIndex(cartItem => cartItem.type === 'donation');
    if (index !== -1) {
      const cartItem = cart.items[index];
      cartItem.price += amount;
      dispatch(updateItem(index, cartItem));
    }
  };
};
