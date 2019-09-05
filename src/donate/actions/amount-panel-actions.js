import { push as pushRoute } from 'connected-react-router';
import { statuses, setStatus, addSaleline } from 'shared/actions';
import { setErrors, clearErrors } from 'form/actions';
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
    const { status, settings, panels } = state;
    const { amountPanel } = panels;

    if (status !== statuses.ready) return;

    dispatch(clearErrors());
    dispatch(setStatus(statuses.busy));

    // Make sure an amount has been selected.
    const selection = amountPanel.selections[amountPanel.frequency];
    if (!selection.amount) {
      dispatch(setErrors([{ message: 'Please select a donation amount.' }]));
      dispatch(setStatus(statuses.ready));
      return;
    }

    const offer = settings.offers.find(
      offer => offer.frequency === amountPanel.frequency
    );

    dispatch(addSaleline({
      offerUid: offer.offerUid,
      offerPaymentUid: offer.offerPaymentUid,
      price: selection.amount,
    }));

    dispatch(pushRoute('/details'));
    dispatch(setStatus(statuses.ready));
  };
};
