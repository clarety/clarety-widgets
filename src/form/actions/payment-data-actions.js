import { types } from './types';
import { statuses } from '../../shared/actions';

export const updatePaymentData = (field, value) => {
  return (dispatch, getState) => {
    // Don't update when busy.
    if (getState().status === statuses.busy) return;

    dispatch({
      type: types.updatePaymentData,
      field,
      value,
    });
  };
};
