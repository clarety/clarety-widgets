import { types } from 'registrations/actions';

export const setFirstNames = firstNames => ({
  type: types.panelDataSetFirstNames,
  firstNames,
});

export const resetFirstNames = () => ({
  type: types.panelDataResetFirstNames,
});

export const setDetails = (index, customerForm, extendForm) => ({
  type: types.panelDataSetDetails,
  index,
  customerForm,
  extendForm,
});

export const setAdditionalData = (index, additionalData) => ({
  type: types.panelDataSetAdditionalData,
  index,
  additionalData,
});

export const setParticipantErrors = (index, errors) => ({
  type: types.panelDataSetErrors,
  index,
  errors,
});

export const resetDetails = index => ({
  type: types.panelDataResetDetails,
  index,
});
