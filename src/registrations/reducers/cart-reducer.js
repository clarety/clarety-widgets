import { types } from 'registrations/actions';

const initialState = {
  uid: null,
  jwt: null,
  status: null,
  items: null,
  summary: {
    total: null,
  },

  errors: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.registrationCreateRequest:
      return {
        ...state,
        errors: null,
      };

    case types.registrationCreateSuccess:
      return {
        ...state,
        uid: action.result.uid,
        jwt: action.result.jwt,
        status: action.result.sale.status,
        items: action.result.sale.salelines,
        summary: {
          ...state.summary,
          total: action.result.sale.total,
        }
      };

    case types.registrationCreateFailure:
      return {
        ...state,
        errors: action.result.validationErrors,
      };

    default:
      return state;
  }
};
