import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, AddressFinder } from 'shared/components';
import { requiredField, emailField, getCustomerTypeOptions, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { TextInput, EmailInput, PhoneInput, CheckboxInput, StateInput, CountryInput, SelectInput, PostcodeInput, SubmitButton, BackButton, ErrorMessages, FormElement } from 'form/components';

export class CustomerPanel extends BasePanel {
  state = {};

  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  shouldUseAddressFinder() {
    return this.props.addressFinderKey && this.props.defaultCountry;
  }

  onAddressFinderSelect = (address) => {
    this.props.setFormData({
      'customer.billing.address1': address.address1,
      'customer.billing.address2': address.address2,
      'customer.billing.suburb':   address.suburb,
      'customer.billing.state':    address.state,
      'customer.billing.postcode': address.postcode,
      'customer.billing.country':  address.country,
      'customer.billing.pdid':     address.pdid,
    });
  };

  onPressDisableAddressFinder = () => this.setState({
    disableAddressFinder: true,
  });

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout } = this.props;

    if (layout === 'page') return;

    const isValid = this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    this.onPressDisableAddressFinder();
    nextPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    this.validateTypeFields(errors);
    this.validateBasicFields(errors);
    this.validatePhoneField(errors);
    this.validateAddressFields(errors);
    this.validateSourceFields(errors);
  }

  validateTypeFields(errors) {
    const { formData, settings } = this.props;

    if (settings.showCustomerType) {
      requiredField(errors, formData, 'customer.type');
    }

    if (formData['customer.type'] === 'business') {
      requiredField(errors, formData, 'customer.businessName');
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

  validateAddressFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'customer.billing.address1');

    if (formData['customer.billing.country'] !== 'NZ') {
      requiredField(errors, formData, 'customer.billing.suburb');
    }

    requiredField(errors, formData, 'customer.billing.state');
    requiredField(errors, formData, 'customer.billing.postcode');
    requiredField(errors, formData, 'customer.billing.country');
  }

  validateSourceFields(errors) {
    const { formData } = this.props;

    if (this.shouldShowSourceFields()) {
      requiredField(errors, formData, 'sale.sourceId');

      const sourceOption = this.getSelectedSourceOption();
      if (sourceOption && sourceOption.additionalRequired) {
        requiredField(errors, formData, 'sale.sourceAdditional');
      }
    }
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
    return (
      <form onSubmit={this.onPressNext} data-testid="customer-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="customer-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderErrorMessages()}
          {this.renderTypeFields()}
          {this.renderBasicFields()}
          {this.renderPhoneField()}
          {this.renderAddressFields()}
          {this.renderSourceFields()}
          {this.renderOptIn()}
        </PanelBody>

        {this.renderFooter()}
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
      />
    );
  }

  renderErrorMessages() {
    if (this.props.layout === 'page') return null;
    return <ErrorMessages />;
  }

  renderTypeFields() {
    const { settings, formData } = this.props;
    const showBusinessName = formData['customer.type'] === 'business';
    const customerTypeOptions = getCustomerTypeOptions();

    return (
      <React.Fragment>
        {settings.showCustomerType &&
          <Form.Row>
            <Col>
              <Form.Group controlId="customerType">
                <Form.Label>{t('type', 'Type')}</Form.Label>
                <SelectInput
                  field="customer.type"
                  options={customerTypeOptions}
                  initialValue={customerTypeOptions[0].value}
                  testId="customer-type-input"
                  required
                />
              </Form.Group>
            </Col>
          </Form.Row>
        }

        {showBusinessName &&
          <Form.Row>
            <Col>
              <Form.Group controlId="businessName">
                <Form.Label>{t('business-name', 'Business Name')}</Form.Label>
                <TextInput field="customer.businessName" testId="business-name-input" required />
              </Form.Group>
            </Col>
          </Form.Row>
        }
      </React.Fragment>
    );
  }

  renderBasicFields() {
    const { canEditEmail } = this.props;

    return (
      <React.Fragment>
        <Form.Row>
          <Col sm>
            <Form.Group controlId="firstName">
              <Form.Label>{t('first-name', 'First Name')}</Form.Label>
              <TextInput field="customer.firstName" testId="first-name-input" required />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="lastName">
              <Form.Label>{t('last-name', 'Last Name')}</Form.Label>
              <TextInput field="customer.lastName" testId="last-name-input" required />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Group controlId="email">
          <Form.Label>{t('email', 'Email')}</Form.Label>
          <EmailInput field="customer.email" type="email" testId="email-input" readOnly={!canEditEmail} required />
        </Form.Group>
      </React.Fragment>
    );
  }

  renderPhoneField() {
    const { settings } = this.props;

    if (settings.phoneType === 'mobile') {
      return (
        <Form.Row>
          <Col>
            <Form.Group controlId="mobile">
              <Form.Label>{t('mobile', 'Mobile')}</Form.Label>
              <PhoneInput field="customer.mobile" required={settings.isPhoneRequired} />
            </Form.Group>
          </Col>
        </Form.Row>
      );
    }

    return null;
  }

  renderAddressFields() {
    const { disableAddressFinder } = this.state;
    const country = this.props.formData['customer.billing.country'];

    if (this.shouldUseAddressFinder() && !disableAddressFinder) {
      return (
        <React.Fragment>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label htmlFor="address-finder-input">{t('address', 'Address')}</Form.Label>
                <AddressFinder
                  id="address-finder-input"
                  apiKey={this.props.addressFinderKey}
                  country={this.props.defaultCountry}
                  onSelect={this.onAddressFinderSelect}
                />

                <Button variant="link" onClick={this.onPressDisableAddressFinder}>
                  {t('cant-find-your-address', "Can't find your address?")}
                </Button>
              </Form.Group>
            </Col>
          </Form.Row>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {this.renderCountryField()}

        <Form.Row>
          <Col sm>
            <Form.Group controlId="street">
              <Form.Label>{t('street', 'Street')}</Form.Label>
              <TextInput field="customer.billing.address1" type="street" testId="street-input" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="suburb">
              <Form.Label>{getSuburbLabel(country)}</Form.Label>
              <TextInput field="customer.billing.suburb" testId="suburb-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group controlId="state">
              <Form.Label>{getStateLabel(country)}</Form.Label>
              <StateInput field="customer.billing.state" country={country} testId="state-input" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="postcode">
              <Form.Label>{getPostcodeLabel(country)}</Form.Label>
              <PostcodeInput field="customer.billing.postcode" country={country} testId="postcode-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderCountryField() {
    const { settings, defaultCountry } = this.props;

    if (!settings.showCountry) {
      return (
        <FormElement
          field="customer.billing.country"
          value={defaultCountry}
        />
      );
    }

    return (
      <Form.Row>
        <Col>
          <Form.Group controlId="country">
            <Form.Label>{t('country', 'Country')}</Form.Label>
            <CountryInput
              field="customer.billing.country"
              initialValue={defaultCountry}
              region={settings.region}
              testId="country-input"
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderSourceFields() {
    if (!this.shouldShowSourceFields()) return null;

    const sourceOption = this.getSelectedSourceOption();
    const showQuestion = sourceOption && sourceOption.additionalDescription;

    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="customerSource">
              <Form.Label>{t('how-did-you-hear-about-us', 'How did you hear about us?')}</Form.Label>
              <SelectInput
                field="sale.sourceId"
                options={this.props.sourceOptions}
                testId="source-id-input"
                required
              />
            </Form.Group>
          </Col>
        </Form.Row>

        {showQuestion &&
          <Form.Row>
            <Col>
              <Form.Group controlId="customerSourceAdditional">
                <Form.Label>{sourceOption.additionalDescription}</Form.Label>
                <TextInput
                  field="sale.sourceAdditional"
                  required={sourceOption.additionalRequired}
                  testId="source-additional-input"
                />
              </Form.Group>
            </Col>
          </Form.Row>
        }
      </React.Fragment>
    );
  }

  renderOptIn() {
    const { settings } = this.props;
    if (!settings.showOptIn) return null;

    return (
      <Row className="optin-checkbox">
        <Col>
          <CheckboxInput
            field="additionalData.optIn"
            label={settings.optInText || t('newsletter-opt-in', 'Sign up for our newsletter')}
            initialValue={!!settings.preTickOptIn}
          />
        </Col>
      </Row>
    );
  }

  renderFooter() {
    const { layout, isBusy, settings } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col xs={6}>
            <BackButton
              title={settings.backBtnText || t('back', 'Back')}
              onClick={this.onPressBack}
              block
            />
          </Col>
          <Col xs={6}>
            <SubmitButton
              title={settings.submitBtnText || t('next', 'Next')}
              testId="next-button"
              block
            />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  shouldShowSourceFields() {
    const { tracking, sourceOptions, settings } = this.props;

    if (tracking.sourceId) return false;
    if (!sourceOptions) return false;

    return settings.showSource;
  }

  getSelectedSourceOption() {
    const sourceValue = this.props.formData['sale.sourceId'];
    return this.props.sourceOptions.find(option => option.value == sourceValue);
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="customer-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
