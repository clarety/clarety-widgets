/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess, customerSearchHasAccount, customerSearchNoAccount, createCustomerSuccess, loginSuccess, getCustomerSuccess, updateShippingSuccess } from 'checkout/mocks';

export function setupCheckoutAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  mock
    .onGet(`${apiBase}checkout/cart/`)
    .reply(200, getCartSuccess);

  mock
    .onGet(`${apiBase}customer-search/`)
    .reply(request => {
      if (request.params.email === 'test@test.com') return [200, customerSearchHasAccount];

      return [200, customerSearchNoAccount];
    });

  mock
    .onPost(`${apiBase}customer-new/`)
    .reply(200, createCustomerSuccess);

  mock
    .onPost(`${apiBase}jwttoken/`)
    .reply(200, loginSuccess);

  // TODO: use shop endpoint, not registration.
  mock
    .onGet(`${apiBase}registration-customer/`)
    .reply(200, getCustomerSuccess);

  mock
    .onPost(`${apiBase}checkout/`)
    .reply(request => {        
      const data = JSON.parse(request.data);

      if (data.shippingOption) return [200, updateShippingSuccess];

      return [200, getCartSuccess];
    });
}
