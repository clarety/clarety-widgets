import { types } from 'shared/actions';

const initialState = {
  id: null,
  uid: null,
  jwt: null,

  store: null,
  status: null,

  items: [],
  customer: {},
  organisation: {},
  payment: {},

  summary: {
    total: null,
  },

  recaptcha: null,

  errors: null,

  tracking: {
    sourceId: null,
    sourceUid: null,
    responseId: null,
    emailResponseId: null,
  },
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

    case types.updateItem:
      return {
        ...state,
        items: state.items.map((item, index) => {
          if (index !== action.index) return item;

          return {
            ...item,
            ...action.item,
          };
        })
      };

    case types.removeItem:
      return {
        ...state,
        items: state.items.filter((item, index) => index !== action.index),
      };

    case types.removeItemsWithPanel:
      return {
        ...state,
        items: state.items.filter(item => item.panel !== action.panel),
      };

    case types.removeItemsWithType:
      return {
        ...state,
        items: state.items.filter(item => item.type !== action.itemType),
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

    case types.setOrganisation:
      return {
        ...state,
        organisation: action.organisation,
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
