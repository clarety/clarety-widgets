import { push as pushRoute } from 'connected-react-router';
import Cookies from 'js-cookie';
import { statuses, setStatus, addItem, setCustomer, updateCartData, clearItems, setRecaptcha } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { executeRecaptcha } from 'form/components';
import { setErrors } from 'form/actions';
import { makePaymentSuccess, makePaymentFailure } from 'donate/actions';
import { getAmountPanelSelection, getSelectedOffer } from 'donate/selectors';

export const submitAmountPanel = () => {
  return (dispatch, getState, { actions, validations }) => {
    actions.panelActions.submitAmountPanel(dispatch, getState, { actions, validations });
  };
};

export const submitDetailsPanel = () => {
  return (dispatch, getState, { actions, validations }) => {
    actions.panelActions.submitDetailsPanel(dispatch, getState, { actions, validations });
  };
};

export const submitPaymentPanel = () => {
  return (dispatch, getState, { actions, validations }) => {
    actions.panelActions.submitPaymentPanel(dispatch, getState, { actions, validations });
  };
};

export class PanelActions {
  async submitAmountPanel(dispatch, getState, { actions, validations }) {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const errors = [];
    const isValid = validations.validateAmountPanel(errors, getState);
    dispatch(setErrors(errors));

    if (isValid) {
      this._addDonationToCart(dispatch, getState);
      dispatch(pushRoute('/details'));
    }

    dispatch(setStatus(statuses.ready));
  }

  async submitDetailsPanel(dispatch, getState, { actions, validations }) {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const errors = [];
    const isValid = validations.validateDetailsPanel(errors, getState);
    dispatch(setErrors(errors));

    if (isValid) {
      this._addCustomerToCart(dispatch, getState);
      dispatch(pushRoute('/payment'));
    }

    dispatch(setStatus(statuses.ready));
  }

  async submitPaymentPanel(dispatch, getState, { actions, validations }) {
    const { status } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const recaptcha = await executeRecaptcha();
    dispatch(setRecaptcha(recaptcha));
    if (!recaptcha) return false;

    const errors = [];
    const isValid = validations.validatePaymentPanel(errors, getState);
    dispatch(setErrors(errors));

    if (isValid) {
      const result = await actions.paymentActions.makePayment(dispatch, getState, { actions, validations });
      this._handlePaymentResult(result, dispatch, getState);
    } else {
      dispatch(setStatus(statuses.ready));
    }
  }

  _addDonationToCart(dispatch, getState) {
    const state = getState();
    const selection = getAmountPanelSelection(state);
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
    const isAmountValid  = validations.validateAmountPanel(errors, getState);
    const isDetailsValid = validations.validateDetailsPanel(errors, getState);
    const isPaymentValid = validations.validatePaymentPanel(errors, getState);
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
