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

    mock
      .onGet('http://dev-test.clarety.io/api/explain/?endpoint=donate')
      .reply(200, explainResponse);
  });

  afterEach(cleanup);

  it('renders without crashing', () => {
    render(<TestDonateWidget />);
  });
});
