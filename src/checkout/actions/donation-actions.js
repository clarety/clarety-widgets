import { ClaretyApi } from 'clarety-utils';
import { fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { types } from 'checkout/actions';

export const fetchPriceHandles = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const params = {
      storeUid:       getSetting(state, 'storeUid'),
      offerSingle:    getSetting(state, 'donationSingleOfferId'),
      offerRecurring: getSetting(state, 'donationRecurringOfferId'),
    };
    const mapToSettings = (result) => ({ priceHandles: result.offers });
    return dispatch(fetchSettings('donations/', params, mapToSettings));
  };
};

export const addDonation = (donation) => {
  return async (dispatch, getState) => {
    const { cart } = getState();

    dispatch(addDonationRequest(donation));

    const results = await ClaretyApi.post(`carts/${cart.cartUid}/donations/`, donation);
    const result = results[0];

    if (result.status === 'error') {
      dispatch(addDonationFailure(result));
    } else {
      dispatch(addDonationSuccess(result));

      // TODO: refresh cart
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
