import { statuses, setStatus, fetchSettings } from 'shared/actions';
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
