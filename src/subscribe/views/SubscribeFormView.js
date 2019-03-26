import React from 'react';
import { Col, Form, Alert } from 'react-bootstrap';
import { BaseFormView } from '../../form/views/BaseFormView';
import { connectFormToStore } from '../../form/utils/form-utils';
import ErrorMessages from '../../form/components/ErrorMessages';
import TextInput from '../../form/components/TextInput';
import SubmitButton from '../../form/components/SubmitButton';
import SelectInput from '../../form/components/SelectInput';
import FormElement from '../../form/components/FormElement';

class SubscribeFormView extends BaseFormView {
  endpoint = 'subscribe';
  action = 'subscribe';

  renderForm() {
    const { listCode } = this.props;

    return (
      <div>
        <ErrorMessages />

        <FormElement property="code" value={listCode} />

        <Form.Row className="mr-0 align-items-start">
          <Col>
            <TextInput property="firstName" placeholder="Name" />
          </Col>

          <Col>
            <TextInput property="email" type="email" placeholder="Email" />
          </Col>

          <Col>
            <SelectInput property="country" placeholder="(Select Country)" testId="hello-test" />
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

export default connectFormToStore(SubscribeFormView);
