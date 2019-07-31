import { types } from '.';

export const setContactDetails = data => ({
  type: types.setContactDetails,
  data: data,
});

export const setPersonalDetails = data => ({
  type: types.setPersonalDetails,
  data: data,
});

export const setShippingDetails = data => ({
  type: types.setShippingDetails,
  data: data,
});
