import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext, getCustomerTypeOptions } from 'shared/utils';
import { getCustomerSubTypeOptions } from 'shared/selectors';
import { BasePanel, TextInput, SelectInput, PhoneInput, DobInput, CheckboxInput, FormElement, Button } from 'checkout/components';

export class CheckoutCustomerPanel extends BasePanel {
  onPressNext = event => {
    event.preventDefault();

    if (this.validate()) {
      this.props.setFormData(this.state.formData);
      this.props.nextPanel();
    }
  };

  validate() {
    const { settings } = this.props;
    const { formData } = this.state;

    const errors = [];

    if (settings.showCustomerType) {
      this.validateRequired('customer.type', errors);
    }

    if (formData['customer.type'] === 'business') {
      this.validateRequired('customer.businessName', errors);
    }

    this.validateRequired('customer.firstName', errors);
    this.validateRequired('customer.lastName', errors);

    if (settings.showDob) {
      this.validateRequired('customer.dateOfBirthDay', errors);
      this.validateRequired('customer.dateOfBirthMonth', errors);
      this.validateRequired('customer.dateOfBirthYear', errors);
    }

    if (this.shouldShowSourceFields()) {
      this.validateRequired('sale.sourceId', errors);

      const sourceOption = this.getSelectedSourceOption();
      if (sourceOption && sourceOption.additionalRequired) {
        this.validateRequired('sale.sourceAdditional', errors);
      }
    }

    if (settings.requirePhone) {
      if (settings.showHomeAndWorkPhone) {
        if (!formData['customer.phone1'] && !formData['customer.phone2'] && !formData['customer.mobile']) {
          this.validateRequired('customer.phone1', errors, t('provide-phone', 'Please provide a phone number'));
        }
      } else {
        this.validateRequired('customer.mobile', errors);
      }
    }

    this.setState({ errors });
    return errors.length === 0;
  }

  componentDidMount() {
    const { customer } = this.props;

    if (customer) this.prefillCustomerData(customer);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
      this.checkForErrors();
    }
  }

  checkForErrors() {
    let foundError = false;

    if (this.hasError('customer.type'))             foundError = true;
    if (this.hasError('customer.businessName'))     foundError = true;
    if (this.hasError('customer.firstName'))        foundError = true;
    if (this.hasError('customer.lastName'))         foundError = true;
    if (this.hasError('customer.phone1'))           foundError = true;
    if (this.hasError('customer.phone2'))           foundError = true;
    if (this.hasError('customer.mobile'))           foundError = true;
    if (this.hasError('customer.dateOfBirthDay'))   foundError = true;
    if (this.hasError('customer.dateOfBirthMonth')) foundError = true;
    if (this.hasError('customer.dateOfBirthYear'))  foundError = true;

    if (foundError) {
      this.props.editPanel();
    }
  }

  prefillCustomerData(customer) {
    let formData = {};

    if (customer) {
      formData = {
        'customer.type':             customer.type,
        'customer.subType':          customer.subType,
        'customer.businessName':     customer.businessName,
        'customer.firstName':        customer.firstName,
        'customer.lastName':         customer.lastName,
        'customer.phone1':           customer.phone1,
        'customer.phone2':           customer.phone2,
        'customer.mobile':           customer.mobile,
        'customer.dateOfBirthDay':   customer.dateOfBirthDay,
        'customer.dateOfBirthMonth': customer.dateOfBirthMonth,
        'customer.dateOfBirthYear':  customer.dateOfBirthYear,
      };
    }

    this.setState({ formData });
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={t('personal-details', 'Personal Details')}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index, settings, defaultCountry } = this.props;
    const { formData } = this.state;

    const showBusinessName = formData['customer.type'] === 'business';
    const customerTypeOptions = getCustomerTypeOptions();

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('personal-details', 'Personal Details')}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <FormContext.Provider value={this.state}>
            <Form onSubmit={this.onPressNext}>

              {settings.showCustomerType &&
                <Form.Row>
                  <Col>
                    <SelectInput
                      field="customer.type"
                      label={t('type', 'Type')}
                      options={customerTypeOptions}
                      initialValue={customerTypeOptions[0].value}
                      testId="customer-type-input"
                      hideLabel
                      required
                    />
                  </Col>
                </Form.Row>
              }

              {showBusinessName &&
                <Form.Row>
                  <Col>
                    <TextInput field="customer.businessName" label={t('business-name', 'Business Name')} hideLabel required />
                  </Col>
                </Form.Row>
              }

              {this.renderCustomerSubTypeFields()}

              <Form.Row>
                <Col sm={6}>
                  <TextInput field="customer.firstName" label={t('first-name', 'First Name')} hideLabel required />
                </Col>
                <Col sm={6}>
                  <TextInput field="customer.lastName" label={t('last-name', 'Last Name')} hideLabel required />
                </Col>
              </Form.Row>

              {settings.showHomeAndWorkPhone &&
                <Form.Row>
                  <Col sm={6}>
                    <PhoneInput
                      field="customer.phone1"
                      label={t('home-phone', 'Home Phone')}
                      hideLabel
                      required={settings.requirePhone}
                      showCountrySelect={settings.showPhoneCountrySelect}
                      country={defaultCountry}
                    />
                  </Col>
                  <Col sm={6}>
                    <PhoneInput
                      field="customer.phone2"
                      label={t('work-phone', 'Work Phone')}
                      hideLabel
                      required={settings.requirePhone}
                      showCountrySelect={settings.showPhoneCountrySelect}
                      country={defaultCountry}
                    />
                  </Col>
                </Form.Row>
              }

              <Form.Row>
                <Col sm={6}>
                  <PhoneInput
                    field="customer.mobile"
                    label={t('mobile-phone', 'Mobile Phone')}
                    hideLabel
                    required={settings.requirePhone}
                    showCountrySelect={settings.showPhoneCountrySelect}
                    country={defaultCountry}
                  />
                </Col>
                <Col sm={6}>
                </Col>
              </Form.Row>

              {settings.showDob &&
                <Form.Row>
                  <Col>
                    <DobInput
                      label={t('date-of-birth', 'Date of Birth')}
                      field="customer.dateOfBirth"
                      dayField="customer.dateOfBirthDay"
                      monthField="customer.dateOfBirthMonth"
                      yearField="customer.dateOfBirthYear"
                      required
                    />
                  </Col>
                </Form.Row>
              }

              {this.renderSourceFields()}

              {this.renderOptInFields()}

              <FormElement
                field="customer.language"
                value={getLanguage()}
              />

              <div className="panel-actions">
                <Button title={t('continue', 'Continue')} type="submit" />
              </div>
            </Form>
          </FormContext.Provider>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderCustomerSubTypeFields() {
    const { settings } = this.props;
    if(!settings.showCustomerSubType) return null;
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <SelectInput
              field="customer.subType"
              placeholder={t('subType', 'Sub Type')}
              options={this.props.customerSubTypeOptions}
              testId="customer-sub-type-input"
              hideLabel
              required
            />
          </Col>
        </Form.Row>
      </React.Fragment>
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
            <SelectInput
              field="sale.sourceId"
              placeholder={t('how-did-you-hear-about-us', 'How did you hear about us?')}
              options={this.props.sourceOptions}
              testId="source-id-input"
              hideLabel
              required
            />
          </Col>
        </Form.Row>

        {showQuestion &&
          <Form.Row>
            <Col>
              <TextInput
                field="sale.sourceAdditional"
                label={sourceOption.additionalDescription}
                required={sourceOption.additionalRequired}
                testId="source-additional-input"
                hideLabel
              />
            </Col>
          </Form.Row>
        }
      </React.Fragment>
    );
  }

  renderOptInFields() {
    const { settings } = this.props;
    if (!settings.showOptIn) return null;

    return (
      <Row className="optin-checkbox">
        <Col>
          <CheckboxInput
            field="customer.optIn"
            label={settings.optInText || t('newsletter-opt-in', 'Sign up to receive our newsletter.')}
            initialValue={settings.preTickOptIn}
          />
        </Col>
      </Row>
    );
  }

  shouldShowSourceFields() {
    const { tracking, sourceOptions, settings } = this.props;

    if (tracking.sourceId) return false;
    if (!sourceOptions) return false;

    return settings.showSource;
  }

  getSelectedSourceOption() {
    const sourceValue = this.state.formData['sale.sourceId'];
    return this.props.sourceOptions.find(option => option.value == sourceValue);
  }

  renderDone() {
    const { layout, index } = this.props;
    const { formData } = this.state;
    const firstName = formData['customer.firstName'];
    const lastName = formData['customer.lastName'];
    const phone = formData['customer.phone1'] || formData['customer.phone2'] || formData['customer.mobile'];

    let title = `${firstName} ${lastName}`;
    if (phone) title += `, ${phone}`;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
