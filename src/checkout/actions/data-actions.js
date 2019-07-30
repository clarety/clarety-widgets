import { types } from '.';

export const setContactDetails = data => ({
  type: types.setContactDetails,
  data: data,
});

export const setPersonalDetails = data => ({
  type: types.setPersonalDetails,
  data: data,
});
