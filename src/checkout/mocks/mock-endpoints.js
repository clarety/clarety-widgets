/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { getCartSuccess } from 'checkout/mocks';

export function setupCheckoutAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  mock.onGet(`${apiBase}checkout/cart/`)
      .reply(200, getCartSuccess);
}
