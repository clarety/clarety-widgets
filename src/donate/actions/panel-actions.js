import Cookies from 'js-cookie';
import { statuses, setStatus, setCustomer, updateCartData, setRecaptcha } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { executeRecaptcha } from 'form/components';
import { setErrors } from 'form/actions';
import { makePaymentSuccess, makePaymentFailure, addDonationToCart } from 'donate/actions';

export const submitCustomerPanel = () => {
  return (dispatch, getState, { actions }) => {
    return actions.panelActions.submitCustomerPanel(dispatch, getState, { actions });
  };
};

export const submitPaymentPanel = () => {
  return (dispatch, getState, { actions }) => {
    return actions.panelActions.submitPaymentPanel(dispatch, getState, { actions });
  };
};

export class PanelActions {
  async submitCustomerPanel(dispatch, getState, { actions }) {
    this._addCustomerToCart(dispatch, getState);
    return true;
  }

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

  _addCustomerToCart(dispatch, getState) {
    const state = getState();
    const formData = parseNestedElements(state.formData);
    dispatch(setCustomer(formData.customer));
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
    this._addCustomerToCart(dispatch, getState);

    // Attempt payment.
    const result = await actions.paymentActions.makePayment(dispatch, getState, { actions });
    this._handlePaymentResult(result, dispatch, getState);
  }
}
