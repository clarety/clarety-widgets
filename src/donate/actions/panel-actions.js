import { statuses, setStatus, setRecaptcha } from 'shared/actions';
import { executeRecaptcha } from 'form/components';
import { makeStripeCCPayment, makeClaretyCCPayment, addDonationToCart, addCustomerToCart, handlePaymentResult } from 'donate/actions';

export const submitPaymentPanel = () => {
  return (dispatch, getState, { actions }) => {
    return actions.panelActions.submitPaymentPanel(dispatch, getState);
  };
};

export class PanelActions {}

export class PagePanelActions extends PanelActions {
  async submitPaymentPanel(dispatch, getState) {
    const { status, settings } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) {
      dispatch(setStatus(statuses.ready));
      return false;
    }

    // Update cart.
    dispatch(addDonationToCart());
    dispatch(addCustomerToCart());

    // Attempt payment.
    let result;
    if (settings.payment.type === 'stripe') {
      result = await dispatch(makeStripeCCPayment());
    } else {
      result = await dispatch(makeClaretyCCPayment());
    }

    return dispatch(handlePaymentResult(result));
  }
}
