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
    .onPost('http://dev-clarety-baseline.clarety.io/api/donate/')
    .reply(config => {
      const query = querystring.parse(config.data);
      const data = JSON.parse(query.data);
      const { saleLine, customer } = data[0];

      console.log(data[0]);

      if (customer) {
        return [200, validationOkResponse];
      } else {
        return [200, validationErrorResponse];
      }
    });

  mock
    .onPost('http://dev-clarety-baseline.clarety.io/api/donate/bd9385e3-6bc4-4885-88d4-b5200d496f33/')
    .reply(config => {
      const query = querystring.parse(config.data);
      const data = JSON.parse(query.data);
      const { saleLine, customer, payment } = data[0];

      console.log(data[0]);

      if (query.action === 'donate') {
        return [200, validationOkResponse];
      }

      if (query.action === 'save') {
        if (customer) {
          return [200, validationOkResponse];
        } else {
          return [200, validationErrorResponse];
        }
      }

      throw new Error(`[Clarety Mock] action '${query.action}' not implemented.`);
    });
};
