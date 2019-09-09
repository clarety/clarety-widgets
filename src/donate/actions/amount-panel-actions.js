import { push as pushRoute } from 'connected-react-router';
import { statuses, setStatus, addItem } from 'shared/actions';
import { validateEmail } from 'shared/utils';
import { setErrors } from 'form/actions';
import { getAmountPanelSelection, getSelectedOffer } from 'donate/selectors';
import { types } from 'donate/actions';

export const selectFrequency = frequency => ({
  type: types.selectFrequency,
  frequency,
});

export const selectAmount = (frequency, amount, isVariableAmount = false) => ({
  type: types.selectAmount,
  frequency,
  amount,
  isVariableAmount,
});

export const submitAmountPanel = () => {
  return (dispatch, getState) => {
    const state = getState();

    if (state.status !== statuses.ready) return;
    dispatch(setStatus(statuses.busy));

    if (validate(dispatch, getState)) {
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
  };
};

const validate = (dispatch, getState) => {
  const errors = [];

  const state = getState();

  // Make sure an amount has been selected.
  const selection = getAmountPanelSelection(state);
  if (!selection.amount) {
    errors.push({
      message: 'Please select a donation amount.',
    });
  }

  // Validate email.
  const email = state.formData['customer.email'];
  if (!validateEmail(email)) {
    errors.push({
      message: 'Please enter a valid email.',
      field: 'customer.email',
    });
  }

  dispatch(setErrors(errors));
  return errors.length === 0;
};
