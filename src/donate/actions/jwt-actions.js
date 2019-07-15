import { types } from 'donate/actions';

export const setJwt = jwt => ({
  type: types.setJwt,
  jwt,
});
