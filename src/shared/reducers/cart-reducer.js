import { types } from 'shared/actions';

const initialState = {
  uid: null,
  jwt: null,

  store: null,

  sourceId: null,
  responseId: null,
  emailResponseId: null,

  status: null,
  items: [],
  customer: {},
  payment: {},

  recaptcha: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.addItem:
      return {
        ...state,
        items: [
          ...state.items,
          action.item,
        ],
      };

    case types.clearItems:
      return {
        ...state,
        items: [],
      };

    case types.setStore:
      return {
        ...state,
        store: action.store,
      };

    case types.updateCartData:
      return {
        ...state,
        ...action.data,
      };

    case types.setCustomer:
      return {
        ...state,
        customer: action.customer,
      };

    case types.setPayment:
      return {
        ...state,
        payment: action.payment,
      };

    case types.clearPayment:
      return {
        ...state,
        payment: {},
      };

    case types.setTracking:
      return {
        ...state,
        sourceId: action.sourceId,
        responseId: action.responseId,
        emailResponseId: action.emailResponseId,
      };

    case types.setRecaptcha:
      return {
        ...state,
        recaptcha: action.recaptcha,
      };

    default:
      return state;
  }
};
