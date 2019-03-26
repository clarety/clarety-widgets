import React from 'react';
import { connectFormToStore } from '../utils/form-utils';
import { BaseFormView } from './BaseFormView';
import ErrorMessages from '../components/ErrorMessages';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import SubmitButton from '../components/SubmitButton';
import FormElement from '../components/FormElement';

class TestFormView extends BaseFormView {
  endpoint = 'test';
  action = 'test';

  renderForm() {
    return (
      <div data-testid="test-form">
        <ErrorMessages />
        <TextInput property="firstName" placeholder="Name" testId="name-input" />
        <TextInput property="email" type="email" placeholder="Email" testId="email-input" />
        <SelectInput property="country" placeholder="(Please Select)" testId="submit-button" />
        <FormElement property="code" value="test-newsletter" />
        <SubmitButton title="Subscribe" testId="submit-button" />
      </div>
    );
  }

  renderSuccess() {
    return (
      <p data-testid="success-message">Thanks for subscribing</p>
    );
  }
}

export default connectFormToStore(TestFormView);
