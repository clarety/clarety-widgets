import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import explainResponse from './explain.json';
import validationOkResponse from './validation-ok.json';
import validationErrorResponse from './validation-error.json';
import paymentOkResponse from './payment-ok.json';
import paymentErrorResponse from './payment-error.json';

export const setupAxiosMock = () => {
  const mock = new MockAdapter(axios, { delayResponse: 500 });

  const params = { store: 'AU', offerSingle: 'widget-single', offerRecurring: 'widget-recurring' };
  mock
    .onGet('http://dev-clarety-baseline.clarety.io/api/widgets/donations/', { params })
    .reply(200, explainResponse);

  mock
    .onPost('http://dev-clarety-baseline.clarety.io/api/donations/')
    .reply(config => {
      const data = JSON.parse(config.data);
      const { saleline, customer, payment, uid, jwt } = data;

      if (uid) {
        console.log('update donation');
        console.log(data);

        if (!jwt) throw new Error('[Mock Endpoint] update donation request is missing JWT.');
        
        if (payment) {
          if (saleline.price > 60) {
            return [200, paymentErrorResponse];
          } else {
            return [200, paymentOkResponse];
          }
        } else if (customer) {
          return [200, validationOkResponse];
        } else {
          return [200, validationErrorResponse];
        }

      } else {
        console.log('create donation');
        console.log(data);

        if (customer) {
          return [200, validationOkResponse];
        } else {
          return [200, validationErrorResponse];
        }
      }
    });
};
