import { removePanels, insertPanels, addItem, removeItemsWithType } from 'shared/actions';
import { getSetting, getCurrentPanelIndex } from 'shared/selectors';
import { types, addDonationToCart } from 'donate/actions';
import { getSelectedOffer, getSelectedPriceHandle, getDonationPanelSelection } from 'donate/selectors';
import { RgUpsellPanel, RgUpsellConnect } from 'donate/components';

export const resetRgUpsell = () => {
  return async (dispatch, getState) => {
    dispatch(removePanels({ withComponent: 'RgUpsellPanel' }));
    dispatch(clearRgUpsell());
  };
};

export const maybeShowRgUpsell = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const layout = getSetting(state, 'layout');

    if (layout === 'tabs') {
      const offer = getSelectedOffer(state);
      const priceHandle = getSelectedPriceHandle(state);
      const offerHasUpsell = !!(offer.rgUpsell && offer.rgUpsell.offerUid && offer.rgUpsell.scheduleUid && offer.rgUpsell.amount1);
      if (offerHasUpsell) {
        const selection = getDonationPanelSelection(state);
        const currentDonationAmount = selection.amount;
        if (!offer.rgUpsell.bypassAmount || currentDonationAmount < offer.rgUpsell.bypassAmount) {
          const upsellAmount1 = getSuggestedRgUpsellAmount(
            priceHandle.rgUpsell ? priceHandle.rgUpsell.amount1 : null,
            offer.rgUpsell.amount1,
            currentDonationAmount,
          );
      
          const upsellAmount2 = getSuggestedRgUpsellAmount(
            priceHandle.rgUpsell ? priceHandle.rgUpsell.amount2 : null,
            offer.rgUpsell.amount2,
            currentDonationAmount,
          );

          if (upsellAmount1 || upsellAmount2) {
            // setup the rg upsell panel.
            const upsellAmounts = [];
            if (upsellAmount1) upsellAmounts.push(upsellAmount1);
            if (upsellAmount2) upsellAmounts.push(upsellAmount2);

            const upsellPanel = {
              component: RgUpsellPanel,
              connect: RgUpsellConnect,
              data: {
                rgUpsell: offer.rgUpsell,
                amounts: upsellAmounts,
              },
            };

            // insert panel after the current panel.
            const currentPanelIndex = getCurrentPanelIndex(state);
            dispatch(insertPanels({
              atIndex: currentPanelIndex + 1,
              panels: [upsellPanel],
            }));
          }
        }
      }
    }
  };
};

function getSuggestedRgUpsellAmount(fixedUpsellAmount, percentageUpsellAmount, currentDonationAmount) {
  if (fixedUpsellAmount) {
    return fixedUpsellAmount;
  }

  if (percentageUpsellAmount) {
    return (percentageUpsellAmount / 100) * Number(currentDonationAmount);
  }

  return null;
}

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
