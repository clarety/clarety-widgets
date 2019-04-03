import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import querystring from 'querystring';
import explainResponse from '../mock-data/explain.json';
import validationOkResponse from '../mock-data/validation-ok.json';
import validationErrorResponse from '../mock-data/validation-error.json';

export const setupAxiosMock = () => {
  const mock = new MockAdapter(axios, { delayResponse: 500 });

  mock
    .onGet('http://dev-clarety-baseline.clarety.io/api/explain/?endpoint=donate')
    .reply(200, explainResponse);

  mock
    .onPost('http://dev-clarety-baseline.clarety.io/api/donate/choose-amount/')
    .reply(config => {
      const query = querystring.parse(config.data);
      const data = JSON.parse(query.data);

      if (data[0].amount) {
        return [200, validationOkResponse];
      } else {
        return [200, validationErrorResponse];
      }
    });
};
