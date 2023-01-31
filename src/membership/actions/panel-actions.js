import { removePanels, insertPanels, resetAllPanels } from 'shared/actions';
import { getIndexOfPanelWithComponent } from 'shared/selectors';
import { getPriceHandles } from 'donate/selectors';

export const ensureValidDonationPanel = (resources) => {
  return async (dispatch, getState) => {
    const state = getState();

    const priceHandles = getPriceHandles(state);
    if (!priceHandles || !priceHandles.length) {
      dispatch(resetAllPanels());
      dispatch(removePanels({ withComponent: 'DonationPanel' }));
    } else {
      // Insert a donation panel 
      if (resources.getComponent('DonationPanel') && getIndexOfPanelWithComponent(state, 'DonationPanel') === -1) {
        dispatch(insertPanels({
          afterComponent: 'MembershipPanel',
          panels: [{
            component: resources.getComponent('DonationPanel'),
            connect: resources.getConnect('DonationConnect'),
          }],
        }));
      }
    }
  };
};
