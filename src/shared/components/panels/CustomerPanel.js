import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField, emailField } from 'shared/utils';
import { TextInput, EmailInput, PhoneInput, CheckboxInput, StateInput, PostcodeInput, SubmitButton, ErrorMessages, FormElement } from 'form/components';

export class CustomerPanel extends BasePanel {
  onClickSubmit = async (event) => {
    event.preventDefault();

    const didValidate = this.validate();
    if (!didValidate) return;
    
    const didSubmit = await this.props.onSubmit();
    if (!didSubmit) return;

    this.props.nextPanel();
  };

  validate() {
    const { formData, setErrors, settings } = this.props;
    const errors = [];

    requiredField(errors, formData, 'customer.firstName');
    requiredField(errors, formData, 'customer.lastName');
    requiredField(errors, formData, 'customer.email');
    emailField(errors, formData, 'customer.email');

    if (settings.isPhoneRequired) {
      requiredField(errors, formData, 'customer.mobile');
    }

    this.validateAddress(errors);

    setErrors(errors);
    return errors.length === 0;
  }

  validateAddress(errors) {
    const { formData, settings } = this.props;
    const { addressType, isAddressRequired } = settings;

    if (!isAddressRequired) return;

    if (addressType === 'postcode') {
      requiredField(errors, formData, 'customer.billing.postcode');
    }

    if (addressType === 'australian') {
      requiredField(errors, formData, 'customer.billing.address1');
      requiredField(errors, formData, 'customer.billing.suburb');
      requiredField(errors, formData, 'customer.billing.state');
      requiredField(errors, formData, 'customer.billing.postcode');
    }

    if (addressType === 'international') {
      throw new Erorr('[Clarety] Customer Panel validate international address not implemented');
    }

    return errors;
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="customer-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Personal Details"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, isBusy, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="customer-panel">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title}
            subtitle={settings.subtitle}
          />
        }

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages />
          {this.renderCustomerForm()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderCustomerForm() {
    const { isBusy, settings } = this.props;

    return (
      <Form onSubmit={this.onClickSubmit}>
        <Form.Row>
          <Col sm>
            <Form.Group>
              <TextInput field="customer.firstName" placeholder="First Name" required />
            </Form.Group>
          </Col>

          <Col sm>
            <Form.Group>
              <TextInput field="customer.lastName" placeholder="Last Name" required />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <EmailInput field="customer.email" placeholder="Email" required />
            </Form.Group>
          </Col>
        </Form.Row>

        {this.renderPhoneField()}
        {this.renderAddressFields()}

        <Row className="panel-actions">
          <Col className="text-center">
            <SubmitButton title={settings.submitBtnText} isBusy={isBusy} />
          </Col>
        </Row>

        {settings.showOptIn &&
          <Form.Row className="opt-in">
            <Col className="text-center">
              <CheckboxInput field="optIn" label={settings.optInText} />
            </Col>
          </Form.Row>
        }
      </Form>
    );
  }

  renderPhoneField() {
    const { settings } = this.props;

    if (settings.phoneType === 'mobile') {
      return (
        <Form.Row>
          <Col>
            <Form.Group>
              <PhoneInput field="customer.mobile" placeholder="Mobile" required={settings.isPhoneRequired} />
            </Form.Group>
          </Col>
        </Form.Row>
      );
    }

    return null;
  }

  renderAddressFields() {
    const { addressType } = this.props.settings;

    if (addressType === 'postcode') {
      return this.renderPostCodeField();
    }

    if (addressType === 'australian') {
      return this.renderAustralianAddressFields();
    }

    if (addressType === 'international') {
      return this.renderInternationalAddressFields();
    }

    return null;
  }

  renderPostCodeField() {
    const { settings } = this.props;

    return (
      <Form.Row>
        <Col sm>
          <Form.Group>
            <PostcodeInput field="customer.billing.postcode" placeholder="Postcode" required={settings.isAddressRequired} />
          </Form.Group>
        </Col>
        <Col sm></Col>
      </Form.Row>
    );
  }

  renderAustralianAddressFields() {
    const { settings } = this.props;

    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group>
              <TextInput field="customer.billing.address1" placeholder="Street Address 1" required={settings.isAddressRequired} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <TextInput field="customer.billing.address2" placeholder="Street Address 2" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group>
              <TextInput field="customer.billing.suburb" placeholder="Suburb" required={settings.isAddressRequired} />
            </Form.Group>
          </Col>

          <Col sm>
            <Form.Group>
              <StateInput field="customer.billing.state" placeholder="State" required={settings.isAddressRequired} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group>
              <PostcodeInput field="customer.billing.postcode" placeholder="Postcode" required={settings.isAddressRequired} />
            </Form.Group>
          </Col>
          <Col sm></Col>
        </Form.Row>

        <FormElement field="customer.billing.country" value="AU" />
      </React.Fragment>
    );
  }

  renderInternationalAddressFields() {
    throw new Erorr('[Clarety] Customer Panel render international address not implemented');
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="customer-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
