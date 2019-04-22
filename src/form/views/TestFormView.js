import React from 'react';
import { connectFormToStore } from '../utils/form-utils';
import { BaseFormView } from './BaseFormView';
import { TextInput, SelectInput, FormElement, ErrorMessages, SubmitButton } from '../components';

class TestFormView extends BaseFormView {
  endpoint = 'test';

  renderForm() {
    return (
      <div data-testid="test-form">
        <ErrorMessages />
        <TextInput field="firstName" placeholder="Name" testId="name-input" />
        <TextInput field="email" type="email" placeholder="Email" testId="email-input" />
        <SelectInput field="country" placeholder="(Please Select)" testId="country-input" />
        <FormElement field="code" value="test-newsletter" />
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
