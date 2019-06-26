import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import explainOk from './explain-ok';
import validationError from './validation-error';
import validationOk from './validation-ok';

export const setupAxiosMock = () => {
  const mock = new MockAdapter(axios, { delayResponse: 500 });

  mock.onGet('http://dev-clarety-baseline.clarety.io/api/widgets/subscriptions/')
      .reply(200, explainOk);

  // mock.onPost('http://dev-clarety-baseline.clarety.io/api/subscriptions/')
  //     .reply(200, validationError);

  mock.onPost('http://dev-clarety-baseline.clarety.io/api/subscriptions/')
      .reply(200, validationOk);
};
