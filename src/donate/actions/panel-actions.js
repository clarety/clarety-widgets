import { push as pushRoute } from 'connected-react-router';
import { statuses, setStatus, addItem, setCustomer, updateCartData } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
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

    const errors = [];
    const isValid = validations.validateDetailsPanel(errors, getState);
    dispatch(setErrors(errors));

    if (isValid) {
      const formDataObjs = parseNestedElements(formData);
      dispatch(setCustomer(formDataObjs.customer));
      dispatch(pushRoute('/payment'));
    }

    dispatch(setStatus(statuses.ready));
  }

  async submitPaymentPanel(dispatch, getState, { actions, validations }) {
    const { status, settings, formData } = getState();

    if (status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    const errors = [];
    const isValid = validations.validatePaymentPanel(errors, getState);
    dispatch(setErrors(errors));

    if (isValid) {
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

    dispatch(setStatus(statuses.ready));    
  }
}
