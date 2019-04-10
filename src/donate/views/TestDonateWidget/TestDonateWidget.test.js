import React from 'react';
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TestDonateWidget from './TestDonateWidget';
import ClaretyConfig from '../../../shared/services/clarety-config';

import explainResponse from '../../mock-data/explain.json';


// This silences some intentionally triggered UnhandledPromiseRejectionWarning
// that were clogging up the test log. There's a good change this is a bad idea.
process.on('unhandledRejection', () => {});


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

  it('throws an error if "storeCode" is missing', () => {
    const { getByTestId } = render(
      <TestDonateWidget
        onceOfferId="123"
        recurringOfferId="321"
      />
    );
    expect(() => getByTestId('test-panel')).toThrow();
  });

  it('throws an error if "onceOfferId" is missing', () => {
    const { getByTestId } = render(
      <TestDonateWidget
        storeCode="TEST"
        recurringOfferId="312"
      />
    );
    return expect(() => getByTestId('test-panel')).toThrow();
  });

  it('throws an error if "recurringOfferId" is missing', () => {
    const { getByTestId } = render(
      <TestDonateWidget
        storeCode="TEST"
        onceOfferId="123"
      />
    );
    return expect(() => getByTestId('test-panel')).toThrow();
  });
});
