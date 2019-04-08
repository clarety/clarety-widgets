import React from 'react';
import { render, cleanup, fireEvent, waitForElement } from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import querystring from 'querystring';
import TestFormView from './TestFormView';
import ClaretyConfig from '../../shared/services/clarety-config';
import initBasicResponse from '../mock-data/init-basic';
import validationOkResponse from '../mock-data/validation-ok';
import validationErrorResponse from '../mock-data/validation-error';

const mock = new MockAdapter(axios);

const enterText = (input, value) => fireEvent.change(input, { target: { value } });
const selectOption = (input, value) => fireEvent.change(input, { target: { value } });

describe('<TestFormView>', () => {
  beforeEach(() => {
    ClaretyConfig.init({
      env: 'dev',
      instanceKey: 'test',
    });

    mock
      .onGet('http://dev-test.clarety.io/api/explain/?endpoint=test')
      .reply(200, initBasicResponse);
  });

  afterEach(cleanup);

  it('renders without crashing', () => {
    render(<TestFormView />);
  });

  it('initially displays the form panel', async () => {
    const { getByTestId, queryByTestId } = render(
      <TestFormView />
    );

    await waitForElement(() => getByTestId('test-form'));

    expect(queryByTestId('name-input')).not.toBeNull();
    expect(queryByTestId('email-input')).not.toBeNull();
    expect(queryByTestId('country-input')).not.toBeNull();
    expect(queryByTestId('submit-button')).not.toBeNull();

    expect(queryByTestId('success-message')).toBeNull();
  });

  it('posts the expected data when submitted', async () => {
    mock
      .onPost('http://dev-test.clarety.io/api/test/')
      .reply(config => {
        const postData = JSON.parse(config.data);

        expect(postData.firstName).toBe('George Costanza');
        expect(postData.email).toBe('gcostanza@humanfund.org');
        expect(postData.code).toBe('test-newsletter');
        expect(postData.country).toBe('AU');

        return [200, validationOkResponse];
      });

    const { getByTestId } = render(
      <TestFormView />
    );

    await waitForElement(() => getByTestId('test-form'));

    const nameInput = getByTestId('name-input');
    const emailInput = getByTestId('email-input');
    const countryInput = getByTestId('country-input');
    const btn = getByTestId('submit-button');

    enterText(nameInput, 'George Costanza');
    enterText(emailInput, 'gcostanza@humanfund.org');
    selectOption(countryInput, 'AU');
    fireEvent.click(btn);
  });

  it('displays the success panel when validation succeeds', async () => {
    mock
      .onPost('http://dev-test.clarety.io/api/test/')
      .reply(200, validationOkResponse);

    const { getByTestId, queryByTestId } = render(
      <TestFormView />
    );

    await waitForElement(() => getByTestId('test-form'));

    expect(queryByTestId('success-message')).toBeNull();

    const btn = getByTestId('submit-button');
    fireEvent.click(btn);

    await waitForElement(() => getByTestId('success-message'));

    expect(queryByTestId('name-input')).toBeNull();
    expect(queryByTestId('email-input')).toBeNull();
    expect(queryByTestId('submit-button')).toBeNull();
  });

  it('displays errors when validation fails', async () => {
    mock
      .onPost('http://dev-test.clarety.io/api/test/')
      .reply(200, validationErrorResponse);

    const { getByTestId, queryByTestId, getByText, queryByText } = render(
      <TestFormView />
    );

    await waitForElement(() => getByTestId('test-form'));

    const btn = getByTestId('submit-button');
    fireEvent.click(btn);

    await waitForElement(() => getByText('Something went wrong...'));

    expect(queryByText('Name is required')).not.toBeNull();
    expect(queryByText('You must enter a valid email')).not.toBeNull();

    expect(queryByTestId('success-message')).toBeNull();
  });
});

