import { ClaretyApi } from 'clarety-utils';
import { fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { types } from 'checkout/actions';
import { removeItem } from 'checkout/actions/cart-actions';

export const fetchPriceHandles = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const params = {
      storeUid:    getSetting(state, 'storeUid'),
      offerSingle: getSetting(state, 'donationOfferId'),
    };
    const mapToSettings = (result) => ({ priceHandles: result.offers });
    return dispatch(fetchSettings('donations/', params, mapToSettings));
  };
};

export const addDonation = (donation) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    // donations endpoint uses 'amount' not 'price'.
    donation.amount = donation.price;
    donation.price = undefined;

    dispatch(addDonationRequest(donation));

    const results = await ClaretyApi.post(`carts/${cart.cartUid}/donations/`, donation);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(addDonationFailure(result));
    } else {
      dispatch(addDonationSuccess(result));
    }
  };
};

export const removeDonation = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { cart } = state;

    // Remove any items that match our donation offer UID.
    const donationOfferUid = getSetting(state, 'donationOfferUid');
    for (const item of cart.items) {
      if (item.offerUid === donationOfferUid) {
        await dispatch(removeItem(item.itemUid));
      }
    }
  };
};

// Add Donation

const addDonationRequest = (donation) => ({
  type: types.addDonationRequest,
  donation: donation,
});

const addDonationSuccess = (result) => ({
  type: types.addDonationSuccess,
  result: result,
});

const addDonationFailure = (result) => ({
  type: types.addDonationFailure,
  result: result,
});
