import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ClaretyApi } from 'clarety-utils';
import * as responses from 'quiz/mocks';

export function setupQuizAxiosMock() {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  const api = ClaretyApi.getApiBaseUrl().slice(0, -1);

  mock
    .onGet(`${api}/widgets/quiz/`)
    .reply(200, responses.getQuizSettingsSuccess);
}
