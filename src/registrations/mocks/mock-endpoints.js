/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import { registrationFull, registrationSaleSuccess, registrationSaleFailure, registrationPaymentSuccess } from 'registrations/mocks';

export function setupMockEndpoints() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  mock.onGet(`${apiBase}registration-full/`)
      .reply(200, registrationFull);

  mock.onPost(`${apiBase}registration-sale/`)
      .reply(200, registrationSaleSuccess);

  mock.onPost(`${apiBase}registration-payment/`)
      .reply(200, registrationPaymentSuccess);
}
