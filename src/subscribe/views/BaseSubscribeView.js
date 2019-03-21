import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { Col, Form, Alert } from 'react-bootstrap';
import SubscribeApi from '../api/subscribe-api';
import { formStatuses } from '../actions/formStatusActions';
import { connectStore } from '../utils/store-utils';
import SubscribeForm from '../components/SubscribeForm';
import ErrorMessages from '../components/ErrorMessages';
import TextInput from '../components/TextInput';
import SubmitButton from '../components/SubmitButton';
import SelectInput from '../components/SelectInput';

export class BaseSubscribeView extends React.Component {
  async componentDidMount() {
    const { code, setElements, setFormStatus, updateFormData } = this.props;

    updateFormData('code', code);

    const elements = await SubscribeApi.fetchElements();
    if (elements) {
      setElements(elements);
      setFormStatus(formStatuses.ready);
    }
  }

  render() {
    if (this.props.formStatus === formStatuses.uninitialized) {
      return null;
    }

    return (
      <MemoryRouter>
        <Switch>
          <Route path="/subscribe-success" render={this.renderSuccessPanel} />
          <Route default render={this.renderFormPanel} />
        </Switch>
      </MemoryRouter>
    );
  }

  renderFormPanel() {
    return (
      <SubscribeForm>
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

          <SubmitButton title="Subscribe" className="ml-1" />
        </Form.Row>

      </SubscribeForm>
    );
  }

  renderSuccessPanel() {
    return (
      <Alert variant="success" style={{ animation: 'fadein 1s' }}>
        Thanks for subscribing!
      </Alert>
    );
  }
}

// Note: An un-connected BaseSubscribeView is also exported where the class is defined.
export default connectStore(BaseSubscribeView);
