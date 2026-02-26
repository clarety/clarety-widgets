import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, AddressFinder, LoqateInput } from 'shared/components';
import { requiredField, emailField, phoneNumberField, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { Label, TextInput, EmailInput, PhoneInput, CheckboxInput, StateInput, CountryInput, SelectInput, PostcodeInput, SubmitButton, BackButton, ErrorMessages, FormElement, CustomerTypeInput, CustomerSubTypeInput, TitleInput, DobInput } from 'form/components';
import { ExpressDonation } from 'donate/components';

export class CustomerPanel extends BasePanel {
  state = {
    disableAddressFinder: false,
    disableLoqateAddress: false,
  };

  componentDidMount() {
    const { fetchedCustomer, formData } = this.props;

    // Disable address finder if we've fetched a customer with an address.
    if (fetchedCustomer && formData['customer.billing.address1']) {
      this.setState({ disableAddressFinder: true });
    }
    if (fetchedCustomer && formData['customer.billing.address1']) {
      this.setState({ disableLoqateAddress: true });
    }
  }

  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  shouldUseAddressFinder() {
    const { addressFinderKey, addressFinderCountry, defaultCountry, formData } = this.props;
    
    if (addressFinderCountry) {
      if (formData['customer.billing.country'] !== addressFinderCountry) {
        return false;
      }
    }

    return addressFinderKey && defaultCountry;
  }

  shouldUseLoqateAddress(addressType) {
    const { loqateKey, loqateCountry, defaultCountry, formData } = this.props;
 
    if (loqateCountry) {
      if (formData[`customer.billing.country`] !== loqateCountry) {
        return false;
      }
    }

    return loqateKey && defaultCountry;
  }

  isAddressRequired() {
    const { settings } = this.props;

    // NOTE: explicitly check for false, the default (ie 'undefined') is true.
    return settings.showAddress !== false && settings.requireAddress !== false;
  }

  onAddressFinderSelect = (address) => {
    this.props.setFormData({
      'customer.billing.address1': address.address1,
      'customer.billing.address2': address.address2,
      'customer.billing.suburb':   address.suburb,
      'customer.billing.state':    address.state,
      'customer.billing.postcode': address.postcode,
      'customer.billing.country':  address.country,
      'customer.billing.dpid':     address.dpid,
      'customer.billing.metadata': address.metadata,

    });
  };

  onLoqateSelect = (address) => {
    const {apimap} = this.props
    var data = {
      "customer.fieldText": address.fieldText,
      'customer.billing.address1': address.address1,
      'customer.billing.address2': address.address2,
      'customer.billing.suburb':   address.suburb,
      'customer.billing.state':    address.state,
      'customer.billing.postcode': address.postcode,
      'customer.billing.country':  address.country,
      'customer.billing.dpid':     address.dpid,
    }

    if(typeof apimap !== 'undefined' && apimap.length > 0){
      apimap.forEach(element => {
        data[`customer.billing.${element.field}`] = address[element.key];
      });
    }
    
    this.props.setFormData(data);
    this.onLoqateChange(address.fieldText);
  }

  
  onLoqateChange = value => {
    this.props.setFormData({
      'customer.fieldText': value,
    })
  }

  onPressDisableAddressFinder = () => this.setState({
    disableAddressFinder: true,
  });

  onPressDisableLoqate = () => this.setState({
    disableLoqateAddress: true,
  })

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout, isPreview } = this.props;

    if (layout === 'page') return;
    if (isPreview) return nextPanel();

    this.onPressDisableAddressFinder();
    this.onPressDisableLoqate();

    const isValid = await this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    nextPanel();
  };

  async validate() {
    const errors = [];
    await this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  async validateFields(errors) {
    this.validateCustomerTypeFields(errors);
    this.validateTitleField(errors);
    this.validateBasicFields(errors);
    this.validateMobileField(errors);
    this.validateDobField(errors);
    this.validateAddressFields(errors);
    this.validateSourceFields(errors);
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

    if (settings.isPhoneRequired || settings.requireMobile) {
      requiredField(errors, formData, 'customer.mobile');
    }

    if (formData['customer.mobile']) {
      phoneNumberField(errors, formData, 'customer.mobile');
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

  validateAddressFields(errors) {
    const { formData } = this.props;

    if (this.isAddressRequired()) {
      requiredField(errors, formData, 'customer.billing.address1');

      if (formData['customer.billing.country'] !== 'NZ') {
        requiredField(errors, formData, 'customer.billing.suburb');
      }

      requiredField(errors, formData, 'customer.billing.state');
      requiredField(errors, formData, 'customer.billing.postcode');
      requiredField(errors, formData, 'customer.billing.country');
    }
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
          {this.renderExpressCheckout()}
          {this.renderCustomerTypeFields()}
          {this.renderCustomerSubTypeFields()}
          {this.renderTitleField()}
          {this.renderBasicFields()}
          {this.renderMobileField()}
          {this.renderDobField()}
          {this.renderAddressFields()}
          {this.renderLanguageField()}
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

  renderExpressCheckout() {
    const { layout, settings, hasExpressPaymentMethods } = this.props;

    if (layout === 'page') return null; // page uses 'ExpressDonationPanel'
    if (!settings.showExpressCheckoutBtns) return null;
    if (!hasExpressPaymentMethods) return null;

    return (
      <ExpressDonation
        orTitle={settings.orTitle}
      />
    );
  }

  renderCustomerTypeFields() {
    const { settings, fetchedCustomer } = this.props;
    if (!settings.showCustomerType) return null;

    return (
      <CustomerTypeInput readOnly={fetchedCustomer} />
    );
  }

  renderCustomerSubTypeFields() {
    const { settings, fetchedCustomer } = this.props;
    if (!settings.showCustomerSubType) return null;

    return (
      <CustomerSubTypeInput readOnly={fetchedCustomer} />
    );
  }

  renderTitleField() {
    const { settings } = this.props;
    if (!settings.showTitle) return null;

    return (
      <Form.Row>
        <Col>
          <Form.Group>
            <Label required={settings.requireTitle}>
              {t('title', 'Title')}
            </Label>
            <TitleInput
              required={settings.requireTitle}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderBasicFields() {
    const { canEditEmail, fetchedCustomer } = this.props;

    return (
      <React.Fragment>
        <Form.Row>
          <Col sm>
            <Form.Group controlId="firstName">
              <Label required>{t('first-name', 'First Name')}</Label>
              <TextInput field="customer.firstName" testId="first-name-input" required readOnly={fetchedCustomer} />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="lastName">
              <Label required>{t('last-name', 'Last Name')}</Label>
              <TextInput field="customer.lastName" testId="last-name-input" required readOnly={fetchedCustomer} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Group controlId="email">
          <Label required>{t('email', 'Email')}</Label>
          <EmailInput field="customer.email" type="email" testId="email-input" required readOnly={!canEditEmail} />
        </Form.Group>
      </React.Fragment>
    );
  }

  renderMobileField() {
    const { settings } = this.props;

    const showMobile = settings.phoneType === 'mobile' || settings.showMobile;
    if (!showMobile) return null;

    const isRequired = settings.isPhoneRequired || settings.requireMobile;

    return (
      <Form.Row>
        <Col>
          <Form.Group controlId="mobile">
            <Label required={isRequired}>
              {t('mobile', 'Mobile')}
            </Label>
            <PhoneInput
              field="customer.mobile"
              required={isRequired}
              showCountrySelect={settings.showPhoneCountrySelect}
              country={this.props.defaultCountry}
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
    const { settings } = this.props;
    const { disableAddressFinder, disableLoqateAddress } = this.state;
    
    // NOTE: explicitly check for false! the default (ie 'undefined') is true.
    if (settings.showAddress === false) return null;

    if (this.shouldUseAddressFinder() && !disableAddressFinder) {
      return (
        <React.Fragment>
          {this.renderCountryField()}

          <Form.Row>
            <Col>
              <Form.Group>
                <Label
                  htmlFor="address-finder-input"
                  required={this.isAddressRequired()}
                >
                  {t('address', 'Address')}
                </Label>
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
    }else if (this.shouldUseLoqateAddress() && !disableLoqateAddress){
      
      return (
        <React.Fragment>
          {this.renderCountryField()}

          <Form.Row>
            <Col>
              <Form.Group>
                <Label
                  htmlFor="address-loqate-input"
                  required={this.isAddressRequired()}
                >
                  {t('address', 'Address')}
                </Label>
                <LoqateInput
                  id="address-loqate-input"
                  apiKey={this.props.loqateKey}
                  country={[this.props.loqateCountry]}
                  onPlaceSelect={(address) => this.onLoqateSelect(address)}
                  value={this.props.formData['customer.fieldText']}
                  onChange={this.onLoqateChange}
                />
  
                <Button variant="link" onClick={this.onPressDisableLoqate}>
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
        {this.renderStreetAddressFields()}
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
            <Label required={this.isAddressRequired()}>
              {t('country', 'Country')}
            </Label>

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

  renderStreetAddressFields() {
    const country = this.props.formData['customer.billing.country'];
    const required = this.isAddressRequired();

    return (
      <React.Fragment>
        <Form.Row>
          <Col sm>
            <Form.Group controlId="street">
              <Label required={required}>{t('street', 'Street')}</Label>
              <TextInput field="customer.billing.address1" type="street" testId="street-input" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="suburb">
              <Label required={required}>{getSuburbLabel(country)}</Label>
              <TextInput field="customer.billing.suburb" testId="suburb-input" />
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col sm>
            <Form.Group controlId="state">
              <Label required={required}>{getStateLabel(country)}</Label>
              <StateInput field="customer.billing.state" country={country} testId="state-input" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="postcode">
              <Label required={required}>{getPostcodeLabel(country)}</Label>
              <PostcodeInput field="customer.billing.postcode" country={country} testId="postcode-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderLanguageField() {
    return (
      <FormElement
        field="customer.language"
        value={getLanguage()}
      />
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
              <Label required>
                {t('how-did-you-hear-about-us', 'How did you hear about us?')}
              </Label>
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
                <Label required={sourceOption.additionalRequired}>
                  {sourceOption.additionalDescription}
                </Label>
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

    const label = settings.optInText || t('newsletter-opt-in', 'Sign up for our newsletter');

    return (
      <Row className="optin-checkbox">
        <Col>
          <CheckboxInput
            field="additionalData.optIn"
            label={label}
            initialValue={!!settings.preTickOptIn}
          />

          <FormElement
            field="additionalData.optInConsentText"
            value={label}
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
