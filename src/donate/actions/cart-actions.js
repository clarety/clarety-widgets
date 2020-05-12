import { addItem, updateItem, clearItems, setCustomer } from 'shared/actions';
import { getCart } from 'shared/selectors';
import { parseNestedElements, getDefaultOfferPaymentUid } from 'shared/utils';
import { getDonationPanelSelection, getSalelineDescription, getSelectedOffer } from 'donate/selectors';

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

export const addDonationToCart = () => {
  return (dispatch, getState) => {
    const state = getState();
    const selection = getDonationPanelSelection(state);
    const offer = getSelectedOffer(state);
    const offerPaymentUid = getDefaultOfferPaymentUid(offer);
    const description = getSalelineDescription(state);

    dispatch(clearItems());

    dispatch(addItem({
      type: 'donation',
      offerUid: offer.offerUid,
      offerPaymentUid: offerPaymentUid,
      price: selection.amount,
      description: description,
    }));

    return true;
  };
};

export const addCustomerToCart = () => {
  return (dispatch, getState) => {
    const state = getState();
    const formData = parseNestedElements(state.formData);
    dispatch(setCustomer(formData.customer));

    return true;
  };
};
