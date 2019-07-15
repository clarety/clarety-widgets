import { types } from './types';

export const setJwt = jwt => ({
  type: types.setJwt,
  jwt,
});
