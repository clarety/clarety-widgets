import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import explainResponse from '../mock-data/explain.json';
import validationOkResponse from '../mock-data/validation-ok.json';
import validationErrorResponse from '../mock-data/validation-error.json';
import paymentOkResponse from '../mock-data/payment-ok.json';
import paymentErrorResponse from '../mock-data/payment-error.json';

export const setupAxiosMock = () => {
  const mock = new MockAdapter(axios, { delayResponse: 500 });

  const params = { store: 'AU', once: '1234', recurring: '9876' };
  mock
    .onGet('http://dev-clarety-baseline.clarety.io/api/widgets/donations', { params })
    .reply(200, explainResponse);

  mock
    .onPost('http://dev-clarety-baseline.clarety.io/api/donations/')
    .reply(config => {
      const data = JSON.parse(config.data);
      const { saleline, customer } = data;

      console.log(data);

      if (customer) {
        return [200, validationOkResponse];
      } else {
        return [200, validationErrorResponse];
      }
    });

  mock
    .onPost('http://dev-clarety-baseline.clarety.io/api/donations/bd9385e3-6bc4-4885-88d4-b5200d496f33/')
    .reply(config => {
      const data = JSON.parse(config.data);
      const { salelines, customer, payment } = data;

      console.log(data);

      if (payment) {
        if (salelines[0].amount > 60) {
          return [200, paymentErrorResponse];
        } else {
          return [200, paymentOkResponse];
        }
        
      } else {
        if (customer) {
          return [200, validationOkResponse];
        } else {
          return [200, validationErrorResponse];
        }
      }
    });
};
