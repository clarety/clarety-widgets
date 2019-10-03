import { types } from 'checkout/actions';

const initialState = {
  cartUid: null,
  sale: null,
  items: null,
  customer: null,
  shippingOptions: null,
  paymentMethods: null,
  summary: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Cart

    case types.fetchCartSuccess:
    case types.updateSaleSuccess:
    case types.applyPromoCodeSuccess:
      return {
        ...state,
        cartUid: action.result.cartUid,
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

    default:
      return state;
  }
};
