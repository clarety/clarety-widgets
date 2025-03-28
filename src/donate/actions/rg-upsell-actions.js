import { removePanels, addItem, removeItemsWithType } from 'shared/actions';
import { types, addDonationToCart } from 'donate/actions';
import { getDonationPanelSelection } from 'donate/selectors';

export const resetRgUpsell = () => {
  return async (dispatch, getState) => {
    dispatch(removePanels({ withComponent: 'RgUpsellPanel' }));
    dispatch(clearRgUpsell());
  };
};

export const selectRgUpsell = ({ offerUid, scheduleUid, scheduleName, amount }) => {
  return async (dispatch, getState) => {
    const state = getState();

    const selection = getDonationPanelSelection(state);
    const previousAmount = Number(selection.amount);

    // replace the original donation in the cart with the upsell donation.
    dispatch(removeItemsWithType('donation'));
    dispatch(addItem({
      type: 'donation',
      offerUid: offerUid,
      offerPaymentUid: scheduleUid,
      scheduleName: scheduleName,
      price: amount,
      rgUpsellOriginalAmount: previousAmount,
    }));

    // set the rg upsell data in the store.
    dispatch(setRgUpsell({
      offerUid,
      scheduleUid,
      scheduleName,
      amount,
      previousAmount,
    }));
  };
};

export const skipRgUpsell = () => {
  return async (dispatch, getState) => {
    // ensure the original donation is now in the cart.
    dispatch(removeItemsWithType('donation'));
    dispatch(addDonationToCart());

    // remove the rg upsell data in the store.
    dispatch(clearRgUpsell());
  };
};

function setRgUpsell({ offerUid, scheduleUid, scheduleName, amount, previousAmount }) {
  return {
    type: types.setRgUpsell,
    offerUid,
    scheduleUid,
    scheduleName,
    amount,
    previousAmount,
  };
}

function clearRgUpsell() {
  return {
    type: types.clearRgUpsell,
  };
}
