import { types } from 'registration/actions';

const initialState = {
  id: null,
  uid: null,
  jwt: null,

  registrationMode: null,

  status: null,
  customer: null,
  items: null,

  summary: {
    total: null,
  },

  errors: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    // Registration Mode.

    case types.setRegistrationMode:
      return {
        ...state,
        registrationMode: action.mode,
      };

    // Customer.

    case types.fetchAuthCustomerSuccess:
      return {
        ...state,
        customer: action.result,
      };

    // Registration.

    case types.registrationCreateRequest:
      return {
        ...state,
        id: null,
        uid: null,
        jwt: null,
        status: null,
        errors: null,
      };

    case types.registrationCreateSuccess:
      return {
        ...state,
        id: action.result.id,
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

    case types.registrationFetchSuccess:
      return {
        ...state,
        id: action.result.id,
        status: action.result.status,
        items: action.result.salelines,
        summary: {
          ...state.summary,
          total: action.result.total,
        }
      };

    // Default.

    default:
      return state;
  }
};
