import { getPriceHandles } from 'donate/selectors';
import { removePanels } from 'shared/actions';

export const ensureValidDonationPanel = () => {
  return async (dispatch, getState) => {
    const state = getState();

    const priceHandles = getPriceHandles(state);
    if (!priceHandles || !priceHandles.length) {
      dispatch(removePanels({ withComponent: 'DonationPanel' }));
    }
  };
};
