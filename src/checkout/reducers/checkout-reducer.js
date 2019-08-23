import { types } from 'checkout/actions';

const initialState = {
  cart: {},
  shippingOptions: [],
  paymentMethods: [],
  jwt: null,
  customer: null,
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchCartSuccess:
    case types.createCustomerSuccess:
    case types.updateCustomerSuccess:
    case types.updateSaleSuccess:
    case types.applyDiscountCodeSuccess:
      return {
        ...state,
        cart: action.result,
      };

    case types.applyPromoCodeSuccess:
      return {
        ...state,
        cart: action.result,
      };

    case types.fetchShippingOptionsSuccess:
      return {
        ...state,
        shippingOptions: action.results,
      };

    case types.fetchPaymentMethodsSuccess:
      return {
        ...state,
        paymentMethods: action.results,
      };

    // Login

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

    // Logout

    case types.logout:
      return {
        ...state,
        jwt: null,
        customer: null,
      };

    // Fetch Customer

    case types.fetchCustomerRequest:
      return {
        ...state,
        customer: null,
      };

    case types.fetchCustomerSuccess:
      return {
        ...state,
        customer: action.result,
      };

    default:
      return state;
  }
};
