import React from 'react';
import { Col, Form, Alert } from 'react-bootstrap';
import { BaseFormView } from './BaseFormView';
import { connectFormToStore } from '../utils/form-utils';
import ErrorMessages from '../components/ErrorMessages';
import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import SelectInput from '../components/SelectInput';
import HiddenInput from '../components/HiddenInput';


class SubscribeFormView extends BaseFormView {
  endpoint = 'subscribe';
  action = 'subscribe';

  renderForm() {
    return (
      <div>
        <ErrorMessages />

        <Form.Row className="mr-0 align-items-start">
          <Col>
            <TextInput property="firstName" placeholder="Name" />
          </Col>

          <Col>
            <TextInput property="email" type="email" placeholder="Email" />
          </Col>

          <Col>
            <SelectInput property="country" placeholder="(Please Select)" />
          </Col>

          <HiddenInput property="code" value="newsletter" />

          <SubmitButton title="Subscribe" className="ml-1" />
        </Form.Row>
      </div>
    );
  }

  renderSuccess() {
    return (
      <Alert variant="success" style={{ animation: 'fadein 1s' }}>
        Thanks for subscribing!
      </Alert>
    );
  }
}

export default connectFormToStore(SubscribeFormView);
