import { types } from 'registrations/actions';

export const setEvent = (eventId) => ({
  type: types.panelDataSetEvent,
  eventId: eventId,
});

export const resetEvent = () => ({
  type: types.panelDataResetEvent,
});

export const setQtys = (qtys) => ({
  type: types.panelDataSetQtys,
  qtys: qtys,
});

export const resetQtys = () => ({
  type: types.panelDataResetQtys,
});

export const setFirstNames = (firstNames) => ({
  type: types.panelDataSetFirstNames,
  firstNames: firstNames,
});

export const resetFirstNames = () => ({
  type: types.panelDataResetFirstNames,
});

export const setOffers = (offers) => ({
  type: types.panelDataSetOffers,
  offers: offers,
});

export const resetOffers = () => ({
  type: types.panelDataResetOffers,
});

export const setDetails = (index, customerForm, extendForm) => ({
  type: types.panelDataSetDetails,
  index: index,
  customerForm: customerForm,
  extendForm: extendForm,
});

export const setAdditionalData = (index, additionalData) => ({
  type: types.panelDataSetAdditionalData,
  index: index,
  additionalData: additionalData,
});

export const setErrors = (index, errors) => ({
  type: types.panelDataSetErrors,
  index: index,
  errors: errors,
});

export const resetDetails = (index) => ({
  type: types.panelDataResetDetails,
  index: index,
});
