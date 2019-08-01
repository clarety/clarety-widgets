/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess, updateShippingSuccess } from 'checkout/mocks';

export function setupCheckoutAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  mock.onGet(`${apiBase}checkout/cart/`)
      .reply(200, getCartSuccess);

  mock.onPost(`${apiBase}checkout/`)
      .reply(request => {        
        const data = JSON.parse(request.data);

        if (data.shippingOption) return [200, updateShippingSuccess];

        return [200, getCartSuccess];
      });
}
