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
  promoCode: '',

  summary: {
    total: null,
  },

  recaptcha: null,
  turnstileToken: null,

  errors: null,

  tracking: {
    sourceId: null,
    sourceUid: null,
    sendResponseUid: null,
    emailResponseUid: null,
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

    case types.updateCustomer:
      return {
        ...state,
        customer: {
          ...state.customer,
          ...action.customer,
        },
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

    case types.setPromoCode:
      return {
        ...state,
        promoCode: action.promoCode,
      };

    case types.setTrackingData:
      return {
        ...state,
        
        tracking: {
          ...state.tracking,
          ...action.trackingData,
        },
      };

    case types.setRecaptcha:
      return {
        ...state,
        recaptcha: action.recaptcha,
      };

    case types.clearRecaptcha:
      return {
        ...state,
        recaptcha: null,
      };

    case types.setTurnstileToken:
      return {
        ...state,
        turnstileToken: action.turnstileToken,
      };

    default:
      return state;
  }
};
