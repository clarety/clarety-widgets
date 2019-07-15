import React from 'react';
import { Col, Form, Alert } from 'react-bootstrap';
import { _BaseFormView } from 'form/views';
import { connectFormToStore } from 'form/utils';
import { TextInput, SelectInput, FormElement, ErrorMessages, SubmitButton } from 'form/components';

export class _SubscribeWidget extends _BaseFormView {
  endpoint = 'subscriptions';

  renderForm() {
    const { listCode } = this.props;
    if (!listCode) throw new Error('[Clarety] listCode prop is required');

    return (
      <div>
        <ErrorMessages />

        <FormElement field="code" value={listCode} />

        <Form.Row className="mr-0 align-items-start">
          <Col>
            <TextInput field="firstName" placeholder="First Name" />
          </Col>

          <Col>
            <TextInput field="email" type="email" placeholder="Email" />
          </Col>

          <Col>
            <SelectInput field="country" placeholder="(Select Country)" testId="hello-test" />
          </Col>

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

export const SubscribeWidget = connectFormToStore(_SubscribeWidget);
