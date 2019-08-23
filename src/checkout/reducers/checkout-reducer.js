import { types } from 'checkout/actions';

const initialState = {
  uid: null,
  jwt: null,
  sale: null,
  items: null,
  customer: null,
  shippingOptions: null,
  paymentMethods: null,
  summary: null,
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    // Cart

    case types.fetchCartSuccess:
    case types.updateSaleSuccess:
    case types.applyPromoCodeSuccess:
      return {
        ...state,
        uid: action.result.uid,
        sale: action.result.sale,
        items: action.result.items,
        summary: action.result.summary,
      };

    // Customer

    case types.fetchCustomerSuccess:
      return {
        ...state,
        customer: action.result,
      };

    case types.createCustomerSuccess:
    case types.updateCustomerSuccess:
      return {
        ...state,
        customer: action.result.customer,
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
        paymentMethods: action.results,
      };

    // Auth

    case types.loginRequest:
      return {
        ...state,
        jwt: null,
      };

    case types.loginSuccess:
      return {
        ...state,
        jwt: action.result,
      };

    case types.logout:
      return {
        ...state,
        jwt: null,
        customer: null,
      };

    default:
      return state;
  }
};
