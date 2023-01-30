import { statuses, setStatus, fetchSettings } from 'shared/actions';
import { getFormData, getSetting } from 'shared/selectors';
import { getStoreUid } from 'donate/selectors';
import { types } from 'donate/actions';
import { mapDonationSettings } from 'donate/utils';

export const fetchFundOffers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { fundId } = getFormData(state);
    return dispatch(fetchOffers(fundId, fundId));
  };
};

export const fetchOffers = ({ singleOfferId, recurringOfferId, categoryUid }) => {
  return async (dispatch, getState) => {
    dispatch(setStatus(statuses.busy));
    
    const state = getState();
    const storeUid = getStoreUid(state);

    await dispatch(fetchSettings('donations/', {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
      categoryUid: categoryUid,
    }, mapDonationSettings));

    // Select default frequency.
    const defaultFrequency = getSetting(state, 'defaultFrequency');
    if (defaultFrequency) dispatch(selectFrequency(defaultFrequency));

    dispatch(setStatus(statuses.ready));

    return true;
  };
};

export const fetchOffersIfChanged = ({ singleOfferId, recurringOfferId, categoryUid }) => {
  return async (dispatch, getState) => {
    const state = getState();

    const offerDidChange =
      singleOfferId    !== getSetting(state, 'singleOfferId') ||
      recurringOfferId !== getSetting(state, 'recurringOfferId') ||
      categoryUid      !== getSetting(state, 'categoryUid');

    if (offerDidChange) {
      return dispatch(fetchOffers({ singleOfferId, recurringOfferId, categoryUid }));
    }

    return false;
  };
};

export const selectFrequency = (frequency) => ({
  type: types.selectFrequency,
  frequency: frequency,
});

export const selectAmount = (frequency, amount, isVariableAmount = false) => ({
  type: types.selectAmount,
  frequency: frequency,
  amount: amount,
  isVariableAmount: isVariableAmount,
});

export const selectSchedule = (offerPaymentUid) => ({
  type: types.selectSchedule,
  offerPaymentUid: offerPaymentUid,
});

export const adjustAmount = (adjustment) => {
  return (dispatch, getState) => {
    const state = getState();
    const { donationPanel } = state.panels;
    const { frequency, selections } = donationPanel;
    const newAmount = Number(selections[frequency].amount) + adjustment;
    dispatch(selectAmount(frequency, newAmount.toFixed(2), true));
  };
};

export const selectDefaults = (offers) => ({
  type: types.selectDefaults,
  offers: offers,
});

export const handleAmountUrlParam = () => {
  return async (dispatch, getState) => {
    const amount = new URLSearchParams(window.location.search).get('amount');
    if (amount) {
      const offers = getSetting(getState(), 'priceHandles');
      for (const offer of offers) {
        const isVariable = !offer.amounts.find(handle => handle.amount === amount);
        dispatch(selectAmount(offer.frequency, amount, isVariable));
      }
    }
  };
};
