import { cartReducer as sharedCartReducer } from 'shared/reducers';
import { types } from 'registration/actions';

export const cartReducer = (state, action) => {
  switch (action.type) {
    case types.registrationCreateRequest: return registrationCreateRequest(state, action);
    case types.registrationCreateSuccess: return registrationCreateSuccess(state, action);
    case types.registrationCreateFailure: return registrationCreateFailure(state, action);
    case types.registrationFetchSuccess:  return registrationFetchSuccess(state, action);
    default:                              return sharedCartReducer(state, action);
  }
};

function registrationCreateRequest(state, action) {
  return {
    ...state,
    id: null,
    uid: null,
    jwt: null,
    status: null,
    errors: null,
  };
}

function registrationCreateSuccess(state, action) {
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
}

function registrationCreateFailure(state, action) {
  return {
    ...state,
    errors: action.result.validationErrors,
  };
}

function registrationFetchSuccess(state, action) {
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
}
