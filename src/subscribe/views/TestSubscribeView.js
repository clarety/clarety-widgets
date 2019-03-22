import React from 'react';
import { BaseSubscribeView } from './BaseSubscribeView';
import { connectStore } from '../utils/store-utils';
import SubscribeForm from '../components/SubscribeForm';
import ErrorMessages from '../components/ErrorMessages';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import SubmitButton from '../components/SubmitButton';

class TestSubscribeView extends BaseSubscribeView {
  renderFormPanel() {
    return (
      <SubscribeForm testId="subscribe-form">
        <ErrorMessages />
        <TextInput property="firstName" placeholder="Name" testId="name-input" />
        <TextInput property="email" type="email" placeholder="Email" testId="email-input" />
        <SelectInput property="country" placeholder="(Please Select)" testId="submit-button" />
        <SubmitButton title="Subscribe" testId="submit-button" />
      </SubscribeForm>
    );
  }

  renderSuccessPanel() {
    return (
      <p data-testid="success-message">Thanks for subscribing</p>
    );
  }
}

export default connectStore(TestSubscribeView);
