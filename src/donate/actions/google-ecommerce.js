import { getCurrency, getCart } from 'shared/selectors';
import { getSelectedOffer, getDonationPanelSelection, getScheduleLabel } from 'donate/selectors';

export const dispatchGoogleEcommerceEvent = (eventName) => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = getCart(state);
    const currency = getCurrency(state);

    const event = {
      event: eventName,
      ecommerce: {},
    };

    if (eventName === 'view_item_list') {
      const offers = state.settings.priceHandles;

      event.ecommerce.item_list_name = 'Donation Widget';
      event.ecommerce.currency = currency.code;
      event.ecommerce.items = [];
      for (const offer of offers) {
        for (const priceHandle of offer.amounts) {
          const amount = Number(priceHandle.amount);
          if (amount > 0) {
            const item = itemForAmount(offer, amount);
            event.ecommerce.items.push(item);
          }
        }
      }
    } else if (eventName === 'add_to_cart' || eventName === 'begin_checkout' || eventName === 'purchase') {
      const offer = getSelectedOffer(state);
      const selection = getDonationPanelSelection(state);
      const amount = Number(selection.amount);
      const schedule = offer.frequency === 'recurring' ? getScheduleLabel(state) : undefined;
      const item = itemForAmount(offer, amount, schedule);

      event.ecommerce.transaction_id = cart.uid;
      event.ecommerce.currency = currency.code;
      event.ecommerce.value = amount;
      event.ecommerce.items = [item];
    } else {
      console.error(`[Clarety] Failed to dispatch google ecommerce event, unexpected event '${eventName}'`);
      return;
    }

    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ googleEcommerceEvent: event }, '*');
    } else if (dataLayer) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push(event);
    } else {
      console.warn('[Clarety] Failed to dispatch google ecommerce event, missing dataLayer');
    }
  };
};

function itemForAmount(offer, amount, schedule = undefined) {
  return {
    item_id: `${offer.offerUid}--${amount}`,
    item_category: 'Donation',
    item_category2: offer.frequency === 'recurring' ? 'Recurring' : 'One Time',
    item_variant: schedule,
    price: amount,
  };
}
