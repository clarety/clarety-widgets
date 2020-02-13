import Cookies from 'js-cookie';
import { statuses, setStatus, updateCartData, setRecaptcha } from 'shared/actions';
import { executeRecaptcha } from 'form/components';
import { setErrors } from 'form/actions';
import { makePaymentSuccess, makePaymentFailure, addDonationToCart, addCustomerToCart } from 'donate/actions';

export const submitPaymentPanel = () => {
  return (dispatch, getState, { actions }) => {
    return actions.panelActions.submitPaymentPanel(dispatch, getState, { actions });
  };
};

export class PanelActions {
  async submitPaymentPanel(dispatch, getState, { actions }) {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const result = await actions.paymentActions.makePayment(dispatch, getState, { actions });
    return this._handlePaymentResult(result, dispatch, getState);
  }

  _handlePaymentResult(result, dispatch, getState) {
    const { settings } = getState();

    if (result.validationErrors) {
      dispatch(makePaymentFailure(result));

      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
      }));

      dispatch(setErrors(result.validationErrors));
      dispatch(setStatus(statuses.ready));
      return false;
    } else {
      dispatch(makePaymentSuccess(result));

      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
        items: result.salelines,
      }));

      // Redirect on success.
      Cookies.set('session-jwt', result.jwt);
      window.location.href = settings.confirmPageUrl;
      return true;
    }
  }
}

export class PagePanelActions extends PanelActions {
  async submitPaymentPanel(dispatch, getState, { actions }) {
    const { status, settings } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    // Update cart.
    dispatch(addDonationToCart());
    dispatch(addCustomerToCart());

    // Attempt payment.
    const result = await actions.paymentActions.makePayment(dispatch, getState, { actions });
    this._handlePaymentResult(result, dispatch, getState);
  }
}
