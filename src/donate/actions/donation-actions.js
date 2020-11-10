import { statuses, setStatus, fetchSettings } from 'shared/actions';
import { getSelectedFund, getStoreUid } from 'donate/selectors';
import { types } from 'donate/actions';

import { mapDonationSettings } from 'donate/utils';

export const fetchFundOffers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const fund = getSelectedFund(state);
    return dispatch(fetchOffers(fund.singleOfferId, fund.recurringOfferId));
  };
};

export const fetchOffers = (singleOfferId, recurringOfferId) => {
  return async (dispatch, getState) => {
    dispatch(setStatus(statuses.busy));
    
    const state = getState();
    const storeUid = getStoreUid(state);

    await dispatch(fetchSettings('donations/', {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
    }, mapDonationSettings));

    dispatch(setStatus(statuses.ready));

    return true;
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

export const handleUrlParams = () => {
  return async (dispatch, getState) => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const amount = Number(urlParams.get('amount'));
    if (amount) dispatch(selectAmount('single', amount, true));
  };
};
