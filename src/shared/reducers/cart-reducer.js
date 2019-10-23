import { types } from 'shared/actions';

const initialState = {
  uid: null,
  jwt: null,

  store: null,

  status: null,
  items: [],
  customer: {},
  payment: {},

  tracking: {
    sourceId: null,
    sourceUid: null,
    responseId: null,
    emailResponseId: null,
  },

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

    case types.setCaseTypeUid:
      return {
        ...state,
        caseTypeUid: action.caseTypeUid,
      };

    case types.setTrackingData:
      return {
        ...state,
        tracking: {
          sourceId: action.sourceId,
          sourceUid: action.sourceUid,
          responseId: action.responseId,
          emailResponseId: action.emailResponseId,
        },
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
