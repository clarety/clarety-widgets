import { push as pushRoute } from 'connected-react-router';
import { statuses, setStatus, addSaleline } from 'shared/actions';
import { setErrors, clearErrors } from 'form/actions';

export const submitAmountPanel = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { status, explain, panels } = state;
    const { amountPanel } = panels;

    if (status !== statuses.ready) return;

    dispatch(clearErrors());
    dispatch(setStatus(statuses.busy));

    // Make sure an amount has been selected.
    const selection = amountPanel.selections[amountPanel.frequency];
    if (selection.amount) {
      const offer = explain.offers.find(offer => offer.frequency === amountPanel.frequency);

      dispatch(addSaleline({
        offerUid: offer.offerUid,
        offerPaymentUid: offer.offerPaymentUid,
        price: selection.amount,
      }));

      dispatch(pushRoute('/details'));
    } else {
      dispatch(setErrors([{ message: 'Please select a donation amount.' }]));
    }

    dispatch(setStatus(statuses.ready));
  };
};
