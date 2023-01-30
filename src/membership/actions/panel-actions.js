import { removePanels, insertPanels, resetAllPanels } from 'shared/actions';
import { getIndexOfPanelWithComponent } from 'shared/selectors';
import { getPriceHandles } from 'donate/selectors';
import { MembershipWidget } from 'membership/components';

export const ensureValidDonationPanel = () => {
  return async (dispatch, getState) => {
    const state = getState();

    const priceHandles = getPriceHandles(state);
    if (!priceHandles || !priceHandles.length) {
      dispatch(resetAllPanels());
      dispatch(removePanels({ withComponent: 'DonationPanel' }));
    } else {
      // Insert a donation panel 
      if (MembershipWidget.resources.getComponent('DonationPanel') && getIndexOfPanelWithComponent(state, 'DonationPanel') === -1) {
        dispatch(insertPanels({
          afterComponent: 'MembershipPanel',
          panels: [{
            component: 'DonationPanel',
            connect: 'DonationConnect',
          }],
        }));
      }
    }
  };
};
