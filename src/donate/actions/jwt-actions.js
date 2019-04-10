import { actionTypes } from './types';

export const setJwt = jwt => ({
  type: actionTypes.setJwt,
  jwt,
});
