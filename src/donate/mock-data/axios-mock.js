import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import querystring from 'querystring';
import mockInitData from '../mock-data/init.json';
import mockValidationOk from '../mock-data/validation-ok.json';
import mockValidationError from '../mock-data/validation-error.json';

export const setupAxiosMock = () => {
  const mock = new MockAdapter(axios, { delayResponse: 2000 });

  mock
    .onGet('http://dev-clarety-baseline.clarety.io/api/explain/?endpoint=donate')
    .reply(200, mockInitData);

  mock
    .onPost('http://dev-clarety-baseline.clarety.io/api/donate/choose-amount/')
    .reply(config => {
      const query = querystring.parse(config.data);
      const data = JSON.parse(query.data);

      if (data[0].amount) {
        return [200, mockValidationOk];
      } else {
        return [200, mockValidationError];
      }
    });
};
