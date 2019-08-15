/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { customerSearchHasAccount, customerSearchNoAccount, createAccountSuccess, getCustomerSuccess } from 'checkout/mocks';
import { loginSuccess, getCartSuccess, updateAddressSuccess, updateShippingSuccess, paymentSuccess } from 'checkout/mocks';
import { getShippingOptionsSuccess, createCustomerSuccess } from 'checkout/mocks';

export function setupCheckoutAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  // Get cart.
  mock
    .onGet(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/`)
    .reply(200, getCartSuccess);

  // Get shipping options.
  mock
    .onGet(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/shipping-options/`)
    .reply(200, getShippingOptionsSuccess);

  // Create customer.
  mock
    .onPost(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/customers/`)
    .reply(200, createCustomerSuccess);

  // Update customer.
  mock
    .onPut(`${apiBase}carts/8c2756b2-f018-4c27-a025-c31fca7e482b/customers/e7fb8831-4a83-468e-8eec-593185909f18/`)
    .reply(200, createCustomerSuccess);

  mock
    .onGet(`${apiBase}customer-search/`)
    .reply(request => {
      if (request.params.email === 'test@test.com') return [200, customerSearchHasAccount];

      return [200, customerSearchNoAccount];
    });

  mock
    .onPost(`${apiBase}customer-new/`)
    .reply(200, createAccountSuccess);

  mock
    .onPost(`${apiBase}jwttoken/`)
    .reply(200, loginSuccess);

  // TODO: use cart endpoint, not registration.
  mock
    .onGet(`${apiBase}registration-customer/`)
    .reply(200, getCustomerSuccess);

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
