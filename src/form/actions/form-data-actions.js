import { types } from './types';
import { statuses } from '../../shared/actions';

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
