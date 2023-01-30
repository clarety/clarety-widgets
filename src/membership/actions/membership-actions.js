import { statuses, setStatus, fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { getStoreUid } from 'donate/selectors';
import { mapMembershipWidgetSettings } from 'membership/utils';

export const fetchOffers = ({ singleOfferId, recurringOfferId, categoryUid }) => {
  return async (dispatch, getState) => {
    dispatch(setStatus(statuses.busy));
    
    const state = getState();
    const storeUid = getStoreUid(state);

    await dispatch(fetchSettings('membership/', {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
      categoryUid: categoryUid,
    }, mapMembershipWidgetSettings));

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
