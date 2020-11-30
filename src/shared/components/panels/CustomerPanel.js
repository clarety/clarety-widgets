import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField, emailField } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, CheckboxInput, StateInput, PostcodeInput, SubmitButton, ErrorMessages, FormElement, CustomerTypeInput, SalutationInput, DobInput } from 'form/components';

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
    const errors = [];
    this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    this.validateCustomerTypeFields(errors);
    this.validateSalutationField(errors);
    this.validateBasicFields(errors);
    this.validatePhoneField(errors);
    this.validateDobField(errors);
    this.validateAddressFields(errors);
    this.validateDetailsField(errors);
  }

  validateCustomerTypeFields(errors) {
    const { formData, settings } = this.props;

    if (settings.showCustomerType) {
      requiredField(errors, formData, 'customer.type');

      if (formData['customer.type'] === 'business') {
        requiredField(errors, formData, 'customer.businessName');
      }
    }
  }

  validateSalutationField(errors) {
    const { formData, settings } = this.props;

    if (settings.requireSalutation) {
      requiredField(errors, formData, 'customer.salutation');
    }
  }

  validateBasicFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'customer.firstName');
    requiredField(errors, formData, 'customer.lastName');
    requiredField(errors, formData, 'customer.email');
    emailField(errors, formData, 'customer.email');
  }

  validatePhoneField(errors) {
    const { formData, settings } = this.props;

    if (settings.phoneType === 'mobile' && settings.isPhoneRequired) {
      requiredField(errors, formData, 'customer.mobile');
    }
  }

  validateDobField(errors) {
    const { formData, settings } = this.props;

    const atLeastOneInputHasData =
      !!formData['customer.dateOfBirthDay']   ||
      !!formData['customer.dateOfBirthMonth'] ||
      !!formData['customer.dateOfBirthYear'];

    if (settings.requireDob || atLeastOneInputHasData) {
      requiredField(errors, formData, 'customer.dateOfBirthDay');
      requiredField(errors, formData, 'customer.dateOfBirthMonth');
      requiredField(errors, formData, 'customer.dateOfBirthYear');
    }
  }

  validateDetailsField(errors) {
    const { formData, settings } = this.props;

    if (settings.isDetailsRequired) {
      requiredField(errors, formData, 'details');
    }
  }

  validateAddressFields(errors) {
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
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="customer-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title}
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
          {this.renderErrorMessages()}
          {this.renderCustomerForm()}
          {this.renderFooter()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderErrorMessages() {
    return <ErrorMessages />; 
  }

  renderCustomerForm() {
    return (
      <Form onSubmit={this.onClickSubmit}>
        {this.renderCustomerTypeFields()}
        {this.renderSalutationField()}
        {this.renderBasicFields()}
        {this.renderPhoneField()}
        {this.renderDobField()}
        {this.renderAddressFields()}
        {this.renderDetailsField()}
        {this.renderOptIn()}
        {this.renderActions()}
      </Form>
    );
  }

  renderCustomerTypeFields() {
    const { settings } = this.props;
    if (!settings.showCustomerType) return null;

    return (
      <CustomerTypeInput />
    );
  }

  renderSalutationField() {
    const { settings } = this.props;
    if (!settings.showSalutation) return null;

    return (
      <Form.Row>
        <Col>
          <Form.Group>
            <SalutationInput
              required={settings.requireSalutation}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderDobField() {
    const { settings } = this.props;
    if (!settings.showDob) return null;

    return (
      <DobInput
        required={settings.requireDob}
      />
    );
  }

  renderBasicFields() {
    return (
      <React.Fragment>
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
      </React.Fragment>
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

  renderDetailsField() {
    const { settings } = this.props;

    if (!settings.showDetails) return null;

    return (
      <Form.Row className="details">
        <Col>
          <Form.Group>
            <TextAreaInput
              field="details"
              placeholder={settings.detailsText || 'Details'}
              required={settings.isDetailsRequired}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderOptIn() {
    const { settings } = this.props;

    if (!settings.showOptIn) return null;

    return (
      <Form.Row className="opt-in">
        <Col>
          <CheckboxInput field="optIn" label={settings.optInText || 'Subscribe to newsletter'} />
        </Col>
      </Form.Row>
    );
  }

  renderActions() {
    const { settings, isBusy } = this.props;

    return (
      <div className="panel-actions">
        <SubmitButton title={settings.submitBtnText} isBusy={isBusy} />
      </div>
    );
  }

  renderFooter() {
    const { settings } = this.props;

    if (settings.hideFooter) return null;

    if (settings.FooterComponent) return (
      <settings.FooterComponent {...this.props} />
    );

    return null;
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
