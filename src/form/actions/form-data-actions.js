import { statuses } from 'shared/actions';
import { types } from 'form/actions';

export const updateFormData = (field, value) => {
  return (dispatch, getState) => {
    // Don't update when busy.
    if (getState().status === statuses.busy) return;

    dispatch({
      type: types.updateFormData,
      field,
      value,
    });
  };
};
