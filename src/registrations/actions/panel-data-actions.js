import { types } from 'registrations/actions';

export const setAdditionalData = (index, additionalData) => ({
  type: types.panelDataSetAdditionalData,
  index,
  additionalData,
});
