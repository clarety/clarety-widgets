import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField, emailField, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, CheckboxInput, StateInput, PostcodeInput, SubmitButton, ErrorMessages, FormElement, CustomerTypeInput, TitleInput, DobInput } from 'form/components';

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
    this.validateTitleField(errors);
    this.validateBasicFields(errors);
    this.validateMobileField(errors);
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

  validateTitleField(errors) {
    const { formData, settings } = this.props;

    if (settings.requireTitle) {
      requiredField(errors, formData, 'customer.title');
    }
  }

  validateBasicFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'customer.firstName');
    requiredField(errors, formData, 'customer.lastName');
    requiredField(errors, formData, 'customer.email');
    emailField(errors, formData, 'customer.email');
  }

  validateMobileField(errors) {
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
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="customer-panel">
        {this.renderHeader()}

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          {this.renderErrorMessages()}
          {this.renderCustomerForm()}
          {this.renderFooter()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderHeader() {
    const { layout, index, settings } = this.props;

    if (settings.hideHeader) return null;

    return (
      <PanelHeader
        status="edit"
        layout={layout}
        number={index + 1}
        title={settings.title}
        subtitle={settings.subtitle}
      />
    );
  }

  renderErrorMessages() {
    return <ErrorMessages />; 
  }

  renderCustomerForm() {
    return (
      <Form onSubmit={this.onClickSubmit}>
        {this.renderCustomerTypeFields()}
        {this.renderTitleField()}
        {this.renderBasicFields()}
        {this.renderMobileField()}
        {this.renderDobField()}
        {this.renderAddressFields()}
        {this.renderLanguageField()}
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

  renderTitleField() {
    const { settings } = this.props;
    if (!settings.showTitle) return null;

    return (
      <Form.Row>
        <Col>
          <Form.Group>
            <TitleInput
              required={settings.requireTitle}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderBasicFields() {
    return (
      <React.Fragment>
        <Form.Row>
          <Col sm>
            <Form.Group>
              <TextInput
                field="customer.firstName"
                placeholder={t('first-name', 'First Name')}
                required
              />
            </Form.Group>
          </Col>

          <Col sm>
            <Form.Group>
              <TextInput
                field="customer.lastName"
                placeholder={t('last-name', 'Last Name')}
                required
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <EmailInput
                field="customer.email"
                placeholder={t('email', 'Email')}
                required
              />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderMobileField() {
    const { settings } = this.props;

    if (settings.phoneType !== 'mobile') return null;

    return (
      <Form.Row>
        <Col>
          <Form.Group>
            <PhoneInput
              field="customer.mobile"
              placeholder={t('mobile', 'Mobile')}
              showCountrySelect={settings.showPhoneCountrySelect}
              required={settings.isPhoneRequired}
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
    const { settings, formData } = this.props;
    const country = formData['customer.billing.country'];

    return (
      <Form.Row>
        <Col sm>
          <Form.Group>
            <PostcodeInput
              field="customer.billing.postcode"
              placeholder={getPostcodeLabel(country)}
              required={settings.isAddressRequired}
            />
          </Form.Group>
        </Col>
        <Col sm></Col>
      </Form.Row>
    );
  }

  renderAustralianAddressFields() {
    const { settings, formData } = this.props;
    const country = formData['customer.billing.country'];

    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group>
              <TextInput
                field="customer.billing.address1"
                placeholder={t('street', 'Street Address 1')}
                required={settings.isAddressRequired}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <TextInput
                field="customer.billing.address2"
                placeholder={t('street-2', 'Street Address 2')}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group>
              <TextInput
                field="customer.billing.suburb"
                placeholder={getSuburbLabel(country)}
                required={settings.isAddressRequired}  
              />
            </Form.Group>
          </Col>

          <Col sm>
            <Form.Group>
              <StateInput
                field="customer.billing.state"
                placeholder={getStateLabel(country)}
                required={settings.isAddressRequired}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group>
              <PostcodeInput
                field="customer.billing.postcode"
                placeholder={getPostcodeLabel(country)}
                required={settings.isAddressRequired}
              />
            </Form.Group>
          </Col>
          <Col sm></Col>
        </Form.Row>

        <FormElement
          field="customer.billing.country"
          value="AU"
        />
      </React.Fragment>
    );
  }

  renderInternationalAddressFields() {
    throw new Erorr('[Clarety] Customer Panel render international address not implemented');
  }

  renderLanguageField() {
    return (
      <FormElement
        field="customer.language"
        value={getLanguage()}
      />
    );
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
              placeholder={settings.detailsText || t('details', 'Details')}
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
          <CheckboxInput
            field="optIn"
            label={settings.optInText || t('subscribe-to-newsletter', 'Subscribe to newsletter')}
          />
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
