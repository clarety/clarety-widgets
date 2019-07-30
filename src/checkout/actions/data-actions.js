import { types } from '.';

export const setContactDetails = data => ({
  type: types.setContactDetails,
  data: data,
});
