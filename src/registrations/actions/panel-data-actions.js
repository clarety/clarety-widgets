import { types } from 'registrations/actions';

export const setEvent = eventId => ({
  type: types.panelDataSetEvent,
  eventId,
});

export const resetEvent = () => ({
  type: types.panelDataResetEvent,
});

export const setQtys = qtys => ({
  type: types.panelDataSetQtys,
  qtys,
});

export const resetQtys = () => ({
  type: types.panelDataResetQtys,
});

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

export const resetDetails = index => ({
  type: types.panelDataResetDetails,
  index,
});
