import Cookies from 'js-cookie';
import { statuses, setStatus, addItem, setCustomer, updateCartData, clearItems, setRecaptcha } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { executeRecaptcha } from 'form/components';
import { setErrors } from 'form/actions';
import { makePaymentSuccess, makePaymentFailure } from 'donate/actions';
import { getDonationPanelSelection, getSelectedOffer } from 'donate/selectors';

export const submitDonationPanel = () => {
  return (dispatch, getState, { actions, validations }) => {
    return actions.panelActions.submitDonationPanel(dispatch, getState, { actions, validations });
  };
};

export const submitCustomerPanel = () => {
  return (dispatch, getState, { actions, validations }) => {
    return actions.panelActions.submitCustomerPanel(dispatch, getState, { actions, validations });
  };
};

export const submitPaymentPanel = () => {
  return (dispatch, getState, { actions, validations }) => {
    return actions.panelActions.submitPaymentPanel(dispatch, getState, { actions, validations });
  };
};

export class PanelActions {
  async submitDonationPanel(dispatch, getState, { actions, validations }) {
    this._addDonationToCart(dispatch, getState);
    return true;
  }

  async submitCustomerPanel(dispatch, getState, { actions, validations }) {
    this._addCustomerToCart(dispatch, getState);
    return true;
  }

  async submitPaymentPanel(dispatch, getState, { actions, validations }) {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const result = await actions.paymentActions.makePayment(dispatch, getState, { actions, validations });
    return this._handlePaymentResult(result, dispatch, getState);
  }

  _addDonationToCart(dispatch, getState) {
    const state = getState();
    const selection = getDonationPanelSelection(state);
    const offer = getSelectedOffer(state);

    dispatch(clearItems());

    dispatch(addItem({
      offerUid: offer.offerUid,
      offerPaymentUid: offer.offerPaymentUid,
      price: selection.amount,
      type: 'donation',
    }));
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
  async submitPaymentPanel(dispatch, getState, { actions, validations }) {
    const { status, settings } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    // ReCaptcha.
    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    // Validate.
    const errors = [];
    // TODO: validate DonationPanel...
    // TODO: validate CustomerPanel...
    // TODO: validate optional FundraisingPanel...
    // TODO: validate PaymentPanel...
    dispatch(setErrors(errors));

    if (isAmountValid && isDetailsValid && isPaymentValid) {
      // Update store.
      this._addDonationToCart(dispatch, getState);
      this._addCustomerToCart(dispatch, getState);

      // Attempt payment.
      const result = await actions.paymentActions.makePayment(dispatch, getState, { actions, validations });
      this._handlePaymentResult(result, dispatch, getState);
    } else {
      dispatch(setStatus(statuses.ready));
    }
  }
}
