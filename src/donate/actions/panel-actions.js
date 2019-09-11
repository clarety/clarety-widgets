import { push as pushRoute } from 'connected-react-router';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStatus, addItem, setCustomer, updateCartData } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { setErrors, clearErrors } from 'form/actions';
import { updateCartRequest, updateCartSuccess, updateCartFailure } from 'donate/actions';
import { makePaymentSuccess, makePaymentFailure } from 'donate/actions';
import { getAmountPanelSelection, getSelectedOffer, getPaymentData } from 'donate/selectors';
import { validateCard } from 'donate/utils';

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
    const state = getState();

    if (state.status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const errors = [];
    const isValid = validations.validateAmountPanel(errors, getState);
    dispatch(setErrors(errors));

    if (isValid) {
      const selection = getAmountPanelSelection(state);
      const offer = getSelectedOffer(state);
  
      dispatch(addItem({
        offerUid: offer.offerUid,
        offerPaymentUid: offer.offerPaymentUid,
        price: selection.amount,
      }));

      dispatch(pushRoute('/details'));
    }

    dispatch(setStatus(statuses.ready));
  }

  async submitDetailsPanel(dispatch, getState, { actions, validations }) {
    const { status, formData } = getState();

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    const formDataObjs = parseNestedElements(formData);
    dispatch(setCustomer(formDataObjs.customer));

    const { cart } = getState();

    const postData = {
      store: cart.store,
      uid: cart.uid,
      jwt: cart.jwt,
      customer: cart.customer,
      saleline: cart.items[0],
    };

    dispatch(updateCartRequest(postData));
    
    const results = await ClaretyApi.post('donations/', postData);
    const result = results[0];

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(setErrors(result.validationErrors));
      dispatch(updateCartFailure(result));
    } else {
      dispatch(updateCartSuccess(result));
      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
        items: result.salelines,
      }));
      dispatch(pushRoute('/payment'));
    }
  }

  async submitPaymentPanel(dispatch, getState, { actions, validations }) {
    const { status, settings, formData } = getState();

    if (status !== statuses.ready) return;

    dispatch(setStatus(statuses.busy));
    dispatch(clearErrors());

    // Validate card details.

    const paymentData = getPaymentData(formData);

    const errors = validateCard(paymentData);
    if (errors) {
      dispatch(setErrors(errors));
      dispatch(setStatus(statuses.ready));
      return;
    }

    // Attempt payment.

    const { paymentActions } = actions;

    let result;
    if (settings.payment.type === 'stripe') {
      result = await paymentActions.makeStripeCCPayment(dispatch, getState, { actions, validations });
    } else {
      result = await paymentActions.makeClaretyCCPayment(dispatch, getState, { actions, validations });
    }

    // Dispatch results.

    dispatch(setStatus(statuses.ready));

    if (result.validationErrors) {
      dispatch(makePaymentFailure(result));
      dispatch(setErrors(result.validationErrors));
    } else {
      dispatch(makePaymentSuccess(result));

      dispatch(updateCartData({
        uid: result.uid,
        jwt: result.jwt,
        status: result.status,
        customer: result.customer,
        items: result.salelines,
      }));

      dispatch(pushRoute('/success'));
    }
  }
}
