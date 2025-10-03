import { getSetting } from 'shared/selectors';
import { updateAppSettings } from 'shared/actions';
import { isXendit, loadXenditScript } from 'shared/utils';

export const initPaymentGateways = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const paymentMethods = getSetting(state, 'paymentMethods');

    // NOTE: stripe is initialized via the Stripe Elements react component.
    // see shared/components/misc/inject-stripe.js


    // Xendit
    const hasXendit = paymentMethods.some(isXendit);
    if (hasXendit) {
      loadXenditScript();
    }
  }
};

export function openPaymentAuthModal(url) {
  return updateAppSettings({
    paymentAuthModalUrl: url,
  });
}

export function closePaymentAuthModal() {
  return updateAppSettings({
    paymentAuthModalUrl: null,
  });
}

export function onCancelPaymentAuth() {
  const event = new CustomEvent('clarety-payment-auth-result', {
    detail: {
      result: 'cancel',
    },
  });
  window.dispatchEvent(event);
}
