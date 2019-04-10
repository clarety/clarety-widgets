import React from 'react';
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TestDonateWidget from './TestDonateWidget';
import ClaretyConfig from '../../../shared/services/clarety-config';

import explainResponse from '../../mock-data/explain.json';

const mock = new MockAdapter(axios);

describe('<TestDonateWidget>', () => {
  beforeEach(() => {
    ClaretyConfig.init({
      env: 'dev',
      instanceKey: 'test',
    });

    const params = { store: 'TEST', once: '123', recurring: '321' };
    mock
      .onGet('http://dev-test.clarety.io/api/widgets/donations', { params })
      .reply(200, explainResponse);
  });

  afterEach(cleanup);

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <TestDonateWidget
        storeCode="TEST"
        onceOfferId="123"
        recurringOfferId="321"
      />
    );

    await waitForElement(() => getByTestId('test-panel'));
  });
});
