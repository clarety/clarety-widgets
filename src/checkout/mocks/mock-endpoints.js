/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { customerSearchHasAccount, customerSearchNoAccount, createAccountSuccess, getCustomerSuccess } from 'checkout/mocks';
import { loginSuccess, getCartSuccess, updateAddressSuccess, updateShippingSuccess, paymentSuccess } from 'checkout/mocks';
import { createCustomerSuccess, getShippingOptionsSuccess, selectShippingOptionSuccess } from 'checkout/mocks';

export function setupCheckoutAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  // Login.
  mock
    .onPost(`${apiBase}jwttoken/`)
    .reply(200, loginSuccess);

  // Get cart.
  mock
    .onGet(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/`)
    .reply(200, getCartSuccess);

  // Get customer.
  mock
    .onGet(`${apiBase}carts/customers/e7fb8831-4a83-468e-8eec-593185909f18/`)
    .reply(200, getCustomerSuccess);

  // Create customer.
  mock
    .onPost(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/customers/`)
    .reply(200, createCustomerSuccess);

  // Update customer.
  mock
    .onPut(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/customers/e7fb8831-4a83-468e-8eec-593185909f18/`)
    .reply(200, createCustomerSuccess);

  // Get shipping options.
  mock
    .onGet(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/shipping-options/`)
    .reply(200, getShippingOptionsSuccess);

  // Select shipping option.
  mock
    .onPut(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/shipping-options/f5e3ad54-e097-4b6d-8db0-3986916cfb86/`)
    .reply(200, selectShippingOptionSuccess);

  mock
    .onPut(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/shipping-options/f5e68a7d-22ad-4733-b730-a9ef8c4c6bb0/`)
    .reply(200, selectShippingOptionSuccess);



  mock
    .onGet(`${apiBase}customer-search/`)
    .reply(request => {
      const response = request.params.email === 'test@test.com'
                     ? customerSearchHasAccount
                     : customerSearchNoAccount;

      return [200, response];
    });

  mock
    .onPost(`${apiBase}customer-new/`)
    .reply(200, createAccountSuccess);

  mock
    .onPost(`${apiBase}checkout/`)
    .reply(request => {        
      const data = JSON.parse(request.data);

      if (data.payment) return [200, paymentSuccess];

      if (data.shippingOption) return [200, updateShippingSuccess];

      if (data.customer.delivery) return [200, updateAddressSuccess];

      return [200, getCartSuccess];
    });
}
