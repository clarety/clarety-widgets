import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import * as responses from 'checkout/mocks';

export function setupCheckoutAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const api = ClaretyApi.getApiBaseUrl().slice(0, -1);

  // Mock uids.
  const cartUid            = '8c2756b2-f018-4c27-a025-c31fca7e482b';
  const customerUid        = 'e7fb8831-4a83-468e-8eec-593185909f18';
  const shippingOption1Uid = 'f5e3ad54-e097-4b6d-8db0-3986916cfb86';
  const shippingOption2Uid = 'f5e68a7d-22ad-4733-b730-a9ef8c4c6bb0';

  // Login.
  mock
    .onPost(`${api}/jwttoken/`)
    .reply(200, responses.loginSuccess);

  // Get cart.
  mock
    .onGet(`${api}/carts/${cartUid}/`)
    .reply(200, responses.getCartSuccess);

  // Customer search.
  mock
    .onGet(`${api}/customer-search/`)
    .reply(request => {
      const response = request.params.email === 'test@test.com'
                     ? responses.customerSearchHasAccount
                     : responses.customerSearchNoAccount;

      return [200, response];
    });

  // Create account.
  mock
    .onPost(`${api}/customer-new/`)
    .reply(200, responses.createAccountSuccess);

  // Get customer.
  mock
    .onGet(`${api}/carts/customers/${customerUid}/`)
    .reply(200, responses.getCustomerSuccess);

  // Create customer.
  mock
    .onPost(`${api}/carts/${cartUid}/customers/`)
    .reply(200, responses.createCustomerSuccess);

  // Update customer.
  mock
    .onPut(`${api}/carts/${cartUid}/customers/${customerUid}/`)
    .reply(200, responses.createCustomerSuccess);

  // Get shipping options.
  mock
    .onGet(`${api}/carts/${cartUid}/shipping-options/`)
    .reply(200, responses.getShippingOptionsSuccess);

  // Select shipping option.
  mock
    .onPut(`${api}/carts/${cartUid}/shipping-options/${shippingOption1Uid}/`)
    .reply(200, responses.selectShippingOptionSuccess);

  // Select shipping option (alt uid).
  mock
    .onPut(`${api}/carts/${cartUid}/shipping-options/${shippingOption2Uid}/`)
    .reply(200, responses.selectShippingOptionSuccess);

  // Apply promo code.
  mock
    .onPut(`${api}/carts/${cartUid}/promo-codes/`)
    .reply(200, responses.applyPromoCodeSuccess);

  // Get payment methods.
  mock
    .onGet(`${api}/carts/${cartUid}/payment-methods/`)
    .reply(200, responses.getPaymentMethodsSuccess);

  // Make payment.
  mock
    .onPost(`${api}/carts/${cartUid}/payments/`)
    .reply(200, responses.makePaymentSuccess);
}
