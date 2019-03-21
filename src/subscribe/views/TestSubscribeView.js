import React from 'react';
import { Form, Button } from 'react-bootstrap';
import BaseSubscribeView from './BaseSubscribeView';
import { connectStore } from '../utils/store-utils';
import SubscribeForm from '../components/SubscribeForm';
import ErrorMessages from '../components/ErrorMessages';
import TextInput from '../components/TextInput';

class TestSubscribeView extends BaseSubscribeView {
  renderFormPanel() {
    return (
      <SubscribeForm testId="subscribe-form">
        <ErrorMessages />

        <Form.Group>
          <TextInput property="name" testId="name-input" />
        </Form.Group>

        <Form.Group>
          <TextInput property="email" type="email" testId="email-input" />
        </Form.Group>

        <Button type="submit" data-testid="submit-button">Subscribe</Button>
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
