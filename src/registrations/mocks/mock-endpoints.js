import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import * as responses from 'registrations/mocks';

export function setupRegistrationsAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const apiBase = ClaretyApi.getApiBaseUrl();

  mock.onGet(`${apiBase}registration-events/`)
      .reply(200, responses.registrationEvents);

  mock.onGet(`${apiBase}registration-full/`)
      .reply(200, responses.registrationFull);

  mock.onGet(`${apiBase}registration-teams/`)
      .reply(200, responses.searchTeamsSuccess);

  mock.onPost(`${apiBase}registration-sale-widget/`)
      .reply(200, responses.registrationSaleSuccess);

  mock.onPost(`${apiBase}registration-payment-widget/`)
      .reply(200, responses.registrationPaymentSuccess);
}
