import { addItem, updateItem, removeItemsWithType, setCustomer, setTrackingData } from 'shared/actions';
import { getCart, getParsedFormData } from 'shared/selectors';
import { getDonationPanelSelection, getDonationStartDate, getDonationGivingType } from 'donate/selectors';

export const adjustDonation = (amount) => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);

    const index = cart.items.findIndex(item => item.type === 'donation');
    if (index !== -1) {
      const cartItem = cart.items[index];
      dispatch(updateItem(index, {
        ...cartItem,
        price: cartItem.price + amount,
      }));
    }
  };
};

export const addDonationToCart = () => {
  return (dispatch, getState) => {
    const state = getState();
    const selection = getDonationPanelSelection(state);
    const description = getDonationGivingType(state);

    dispatch(removeItemsWithType('donation'));

    dispatch(addItem({
      type:            'donation',
      offerUid:        selection.offerUid,
      offerPaymentUid: selection.offerPaymentUid,
      price:           selection.amount,
      description:     description,
    }));

    return true;
  };
};

export const addCustomerToCart = () => {
  return (dispatch, getState) => {
    const state = getState();
    const formData = getParsedFormData(state);

    dispatch(setCustomer(formData.customer));

    // Set sale source.
    if (formData.sale && formData.sale.sourceId) {
      dispatch(setTrackingData({
        sourceId:         formData.sale.sourceId,
        sourceAdditional: formData.sale.sourceAdditional,
      }));
    }

    return true;
  };
};

export const setDonationStartDate = () => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);
    const startDate = getDonationStartDate(state);

    const index = cart.items.findIndex(item => item.type === 'donation');
    if (index !== -1) {
      const cartItem = cart.items[index];
      dispatch(updateItem(index, {
        ...cartItem,
        startDate,
      }));
    }
  };
};
