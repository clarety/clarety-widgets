import { types as sharedTypes } from 'shared/actions';
import { types } from 'checkout/actions';

const initialState = {
  cartUid: null,
  status: null,
  shippingRequired: null,
  currency: null,
  sale: null,
  items: null,
  customer: null,
  shippingOptions: null,
  paymentMethods: null,
  summary: null,

  tracking: {
    sourceId: null,
    sourceUid: null,
    sendResponseUid: null,
    emailResponseUid: null,
  },
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Cart

    case types.fetchCartSuccess:
    case types.updateSaleSuccess:
    case types.applyPromoCodeSuccess:
      // Only update customer if we don't already have one.
      const customer = state.customer || { customerUid: action.result.customerUid };

      return {
        ...state,
        cartUid: action.result.cartUid,
        status: action.result.status,
        shippingRequired: action.result.shippingRequired,
        currency: action.result.currency,
        customer: customer,
        sale: action.result.sale,
        items: action.result.items,
        summary: action.result.summary,
      };

    // Customer

    case types.createCustomerSuccess:
    case types.updateCustomerSuccess:
      return {
        ...state,
        customer: action.result.customer,
      };

    case sharedTypes.setCustomer:
      return {
        ...state,
        customer: action.customer,
      };

    // Shipping Options

    case types.fetchShippingOptionsSuccess:
      return {
        ...state,
        shippingOptions: action.results,
      };

    // Payment Methods

    case types.fetchPaymentMethodsSuccess:
      return {
        ...state,
        paymentMethods: action.result.types,
      };

    // Payment

    case sharedTypes.setPayment:
      return {
        ...state,
        payment: action.payment,
      };

    // Logout

    case sharedTypes.logoutSuccess:
      return {
        ...state,
        customer: null,
      };

    default:
      return state;
  }
};
