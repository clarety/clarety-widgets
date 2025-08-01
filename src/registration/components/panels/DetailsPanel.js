import React from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, AddressFinder } from 'shared/components';
import { FormContext, parseNestedElements, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { TextInput, TextAreaInput, NumberInput, EmailInput, DateInput, DobInput, CheckboxInput, CheckboxesInput, RadioGroupInput, SimpleSelectInput, PhoneInput, StateInput, PostcodeInput, CountryInput, FormElement } from 'registration/components';
import { getGenderOptions, scrollIntoView } from 'registration/utils';

export class DetailsPanel extends BasePanel {
  ref = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onFormChange,
    };
  }

  onShowPanel() {
    super.onShowPanel();

    const { settings } = this.props;

    // Pre-tick 'billing same as delivery'.
    if (settings.showDeliveryAddress && settings.showBillingAddress) {
      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          'autofill.billing': true,
        }
      }));
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.handleParticipantPropUpdate(this.props.participant);
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    this.handleParticipantPropUpdate(this.props.participant, prevProps.participant);
  }

  handleParticipantPropUpdate(participant, prevParticipant = {}) {
    if (participant) {
      if (participant.errors !== prevParticipant.errors) {
        this.setState({ errors: participant.errors });
      }
  
      if (participant.customer !== prevParticipant.customer) {
        this.prefillCustomerFormData(participant.customer);
      }

      if (participant.offerId !== prevParticipant.offerId) {
        this.onFormChange('waveProductId', undefined);
      }
    }
  }

  onClickNext = async event => {
    event.preventDefault();

    const { nextPanel, setDetails, participantIndex, setWaveInCart } = this.props;

    this.copyAutofilledFields();

    if (this.validate()) {
      this.onSubmitForm();

      const formData = parseNestedElements(this.state.formData);
      
      // Update cart.
      const selectedAddOns = this.getSelectedAddOns(formData);
      this.addAddOnsToCart(selectedAddOns);
      setWaveInCart(participantIndex, formData.waveProductId);

      // Update partcipant.
      setDetails(
        participantIndex,
        formData.customer,
        formData.extendForm,
        formData.waveProductId,
        selectedAddOns,
      );

      nextPanel();
    }
  };

  onClickEdit = () => {
    const { editPanel, participantIndex, removeAddOnsFromCart } = this.props;
    removeAddOnsFromCart(participantIndex);
    editPanel();
  };

  onFormChange = (field, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
      errors: prevState.errors.filter(error => error.field !== field),
    }));
  }

  prefillCustomerFormData(customer) {
    const { settings, event } = this.props;

    const formData = {};

    let disableAddressFinders = false;

    formData['customer.id']        = customer.id;
    formData['customer.firstName'] = customer.firstName;
    formData['customer.lastName']  = customer.lastName;
    formData['customer.email']     = customer.email;
    formData['customer.mobile']    = customer.mobile;
    formData['customer.gender']    = customer.gender;

    formData['customer.dateOfBirthDay']   = customer.dateOfBirthDay;
    formData['customer.dateOfBirthMonth'] = customer.dateOfBirthMonth;
    formData['customer.dateOfBirthYear']  = customer.dateOfBirthYear;

    if (settings.showBillingAddress && customer.billing) {
      disableAddressFinders = true;
      formData['customer.billing.address1'] = customer.billing.address1;
      formData['customer.billing.address2'] = customer.billing.address2;
      formData['customer.billing.suburb']   = customer.billing.suburb;
      formData['customer.billing.state']    = customer.billing.state;
      formData['customer.billing.postcode'] = customer.billing.postcode;
      formData['customer.billing.country']  = customer.billing.country || event.country;
    }

    if (settings.showDeliveryAddress && customer.delivery) {
      disableAddressFinders = true;
      formData['customer.delivery.address1'] = customer.delivery.address1;
      formData['customer.delivery.address2'] = customer.delivery.address2;
      formData['customer.delivery.suburb']   = customer.delivery.suburb;
      formData['customer.delivery.state']    = customer.delivery.state;
      formData['customer.delivery.postcode'] = customer.delivery.postcode;
      formData['customer.delivery.country']  = customer.delivery.country || event.country;
    }    

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        ...formData,
      },
      disableAddressFinders,
    }));
  }

  copyAutofilledFields() {
    const { firstParticipant } = this.props;
    const { formData } = this.state;

    if (formData['autofill.email']) {
      formData['customer.email'] = firstParticipant.customer.email;
    }

    if (formData['autofill.mobile']) {
      formData['customer.mobile'] = firstParticipant.customer.mobile;
    }

    if (formData['autofill.address']) {
      if (firstParticipant.customer.billing) {
        formData['customer.billing.address1'] = firstParticipant.customer.billing.address1;
        formData['customer.billing.address2'] = firstParticipant.customer.billing.address2;
        formData['customer.billing.suburb']   = firstParticipant.customer.billing.suburb;
        formData['customer.billing.state']    = firstParticipant.customer.billing.state;
        formData['customer.billing.postcode'] = firstParticipant.customer.billing.postcode;
        formData['customer.billing.country']  = firstParticipant.customer.billing.country;
      }

      if (firstParticipant.customer.delivery) {
        formData['customer.delivery.address1'] = firstParticipant.customer.delivery.address1;
        formData['customer.delivery.address2'] = firstParticipant.customer.delivery.address2;
        formData['customer.delivery.suburb']   = firstParticipant.customer.delivery.suburb;
        formData['customer.delivery.state']    = firstParticipant.customer.delivery.state;
        formData['customer.delivery.postcode'] = firstParticipant.customer.delivery.postcode;
        formData['customer.delivery.country']  = firstParticipant.customer.delivery.country;
      }
    }

    if (formData['autofill.billing'] && !formData['autofill.address']) {
      formData['customer.billing.address1'] = formData['customer.delivery.address1'];
      formData['customer.billing.address2'] = formData['customer.delivery.address2'];
      formData['customer.billing.suburb']   = formData['customer.delivery.suburb'];
      formData['customer.billing.state']    = formData['customer.delivery.state'];
      formData['customer.billing.postcode'] = formData['customer.delivery.postcode'];
      formData['customer.billing.country']  = formData['customer.delivery.country'] ;
    }
  }

  getSelectedAddOns(formData) {
    return Object.keys(formData.addOns || {}).filter(offerId => !!formData.addOns[offerId]);
  }

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.setErrors(errors);

    if (this.hasAddressError(errors)) {
      this.setState({ disableAddressFinders: true });
    }

    return errors.length === 0;
  }

  validateFields(errors) {
    const { eventDate, minAge, maxAge, waveOptions, settings } = this.props;
    const { formData } = this.state;

    this.validateRequired('customer.firstName', formData, errors);
    this.validateRequired('customer.lastName', formData, errors);
    this.validateEmail('customer.email', formData, errors);

    if (settings.isMobileRequired) {
      this.validatePhone('customer.mobile', formData, errors);
    }

    if (settings.showGender && settings.isGenderRequired !== false) {
      this.validateRequired('customer.gender', formData, errors);
    }

    if (settings.isDobRequired !== false) {
      this.validateRequired('customer.dateOfBirthDay', formData, errors);
      this.validateRequired('customer.dateOfBirthMonth', formData, errors);
      this.validateRequired('customer.dateOfBirthYear', formData, errors);

      this.validateDob({
        field: 'customer.dateOfBirth',
        dob: this.getDob(),
        eventDate: eventDate,
        minAge: minAge,
        maxAge: maxAge,
        errors: errors,
      });
    }

    if (settings.isAddressRequired !== false) {
      this.validateAddressFields(errors);
    }

    if (waveOptions.length > 1)  {
      this.validateRequired('waveProductId', formData, errors);
    }
    
    this.validateExtendFields(errors);
  }

  validateAddressFields(errors) {
    const { settings } = this.props;
    const { formData } = this.state;

    if (settings.showBillingAddress) {
      this.validateRequired('customer.billing.address1', formData, errors);
      this.validateRequired('customer.billing.suburb', formData, errors);
      this.validateRequired('customer.billing.state', formData, errors);
      this.validateRequired('customer.billing.postcode', formData, errors);
      this.validateRequired('customer.billing.country', formData, errors);
    }
  }

  validateExtendFields(errors) {
    const { extendFields } = this.props;
    const { formData } = this.state;

    for (const field of extendFields) {
      if (field.required) {
        this.validateRequired(`extendForm.${field.columnKey}`, formData, errors);
      }
    }
  }

  hasAddressError(errors) {
    return errors.some(err =>
      err.field.startsWith('customer.delivery') ||
      err.field.startsWith('customer.billing'));
  }

  onSubmitForm() {
    // Override in subclass.
  }

  addAddOnsToCart(selectedAddOns) {
    const { addAddOnToCart, participantIndex } = this.props;

    selectedAddOns.forEach(offerId => {
      const offer = this.props.addOns.find(offer => offer.offerId === offerId);

      const item = {
        offerId: offer.offerId,
        type: 'add-on',
        price: offer.price,
      };

      addAddOnToCart(item, participantIndex);
    });
  }

  setErrors(errors) {
    const { setErrors, participantIndex } = this.props;
    setErrors(participantIndex, errors);
    scrollIntoView(this.ref);
  }

  shouldUseAddressFinder() {
    return this.props.addressFinderKey
        && this.props.addressFinderCountry
        && !this.state.disableAddressFinders;
  }

  onPressDisableAddressFinder = () => {
    this.setState({ disableAddressFinders: true });
  };

  onAddressFinderSelect = (type, address) => {
    const formData = {
      [`customer.${type}.address1`]: address.address1,
      [`customer.${type}.address2`]: address.address2,
      [`customer.${type}.suburb`]:   address.suburb,
      [`customer.${type}.state`]:    address.state,
      [`customer.${type}.postcode`]: address.postcode,
      [`customer.${type}.country`]:  address.country,
      [`customer.${type}.dpid`]:     address.dpid,
      [`customer.${type}.metadata`]: address.metadata,

    };

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        ...formData,
      }
    }));
  };

  reset() {
    const { resetDetails, participantIndex, removeAddOnsFromCart } = this.props;
    resetDetails(participantIndex);
    removeAddOnsFromCart(participantIndex);
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />
        
        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, registrationErrors } = this.props;
    const firstName = this.state.formData['customer.firstName'];

    const title = (
      <span>{t('detailsPanel.editTitle', 'Registration Details for')}
        <span className="text-highlight"> {firstName}</span>
      </span>
    );

    return (
      <PanelContainer layout={layout} status="edit">
        <div ref={ref => this.ref = ref}>
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={title}
          />

          <Form onSubmit={this.onClickNext}>

            <PanelBody layout={layout} status="edit">
              <Row className="mt-5">
                <Col lg={6}>
                  <h4 className="mb-4">{t('detailsPanel.customerFormTitle', 'Personal Details')}</h4>
                  {this.renderCustomerForm()}
                </Col>
                <Col lg={6}>
                  <h4 className="mb-4">{t('detailsPanel.extendFormTitle', 'Event Details')}</h4>
                  {this.renderExtendForm()}
                </Col>
              </Row>
            </PanelBody>

            {registrationErrors &&
              <Alert variant="danger">
                <ul className="list-unstyled">
                  {registrationErrors.map((error, index) =>
                    <li key={index}>{error.message}</li>
                  )}
                </ul>
              </Alert>
            }

            <Button type="submit">{this.getSubmitBtnText()}</Button>
          </Form>
        </div>
      </PanelContainer>
    );
  }

  renderCustomerForm() {
    const { isPrefilled, appSettings, settings, participantIndex } = this.props;
    const { formData } = this.state;

    const showAutofill = participantIndex !== 0 && !isPrefilled;
    const showAddressAutofill = showAutofill && (settings.showDeliveryAddress || settings.showBillingAddress);

    const showEmail  = !formData['autofill.email'];
    const showMobile = !formData['autofill.mobile'];

    const country = formData['customer.billing.country'];

    return (
      <FormContext.Provider value={this.state}>

        <Form.Row>
          <Col md={6}>
            <TextInput
              field="customer.firstName"
              label={t('label.customer.firstName', 'First Name')}
              disabled={isPrefilled}
              required
            />
          </Col>
          <Col md={6}>
            <TextInput
              field="customer.lastName"
              label={t('label.customer.lastName', 'Last Name')}
              disabled={isPrefilled}
              required
            />
          </Col>
        </Form.Row>

        {showAutofill &&
          <Form.Row>
            <Col>
              <CheckboxInput
                field="autofill.email"
                label={t('label.autofill.email', 'Use email from first participant?')}
                required
              />
            </Col>
          </Form.Row>
        }

        {showEmail &&
          <Form.Row>
            <Col>
              <EmailInput
                field="customer.email"
                label={t('label.customer.email', 'Email')}
                disabled={isPrefilled}
                required
              />
            </Col>
          </Form.Row>
        }

        {settings.showGender &&
          <Form.Row>
            <Col>
              <SimpleSelectInput
                field="customer.gender"
                label={t('label.customer.gender', 'Gender')}
                options={this.translateOptions(getGenderOptions(appSettings))}
                required={settings.isGenderRequired !== false}
              />
            </Col>
          </Form.Row>
        }

        <Form.Row>
          <Col>
            <DobInput
              field="customer.dateOfBirth"
              dayField="customer.dateOfBirthDay"
              monthField="customer.dateOfBirthMonth"
              yearField="customer.dateOfBirthYear"
              label={t('label.customer.dateOfBirth', 'Date of Birth')}
              required={settings.isDobRequired !== false}
            />
          </Col>
        </Form.Row>

        {showAutofill &&
          <Form.Row>
            <Col>
              <CheckboxInput
                field="autofill.mobile"
                label={t('label.autofill.mobile', 'Use mobile from first participant?')}
                required
              />
            </Col>
          </Form.Row>
        }

        {showMobile &&
          <Form.Row>
            <Col>
              <PhoneInput
                field="customer.mobile"
                label={t('label.customer.mobile', 'Mobile')}
                country={country}
                required={settings.isMobileRequired !== false}
              />
            </Col>
          </Form.Row>
        }

        {showAddressAutofill &&
          <Form.Row>
            <Col>
              <CheckboxInput
                field="autofill.address"
                label={t('label.autofill.address', 'Use address from first participant?')}
                required
              />
            </Col>
          </Form.Row>
        }

        {this.renderCustomerAddress()}

        <FormElement
          field="customer.language"
          value={getLanguage()}
        />

      </FormContext.Provider>
    );
  }

  renderCustomerAddress() {
    const { settings } = this.props;
    const { formData } = this.state;

    if (!!formData['autofill.address']) return null;
    
    const showBilling = !formData['autofill.billing'];

    const deliveryAddressTitle = settings.deliveryAddressTitle || t('detailsPanel.deliveryAddressTitle', 'Delivery Address');
    const billingAddressTitle  = settings.billingAddressTitle  || t('detailsPanel.billingAddressTitle',  'Billing Address');

    return (
      <React.Fragment>
        {settings.showDeliveryAddress &&
          this.renderAddressFields(deliveryAddressTitle, 'delivery')
        }

        {settings.showDeliveryAddress && settings.showBillingAddress &&
          <Form.Row>
            <Col>
              <CheckboxInput
                field="autofill.billing"
                label={t('label.autofill.billing', 'Billing Address is same as Delivery Address')}
                required
              />
            </Col>
          </Form.Row>
        }

        {settings.showBillingAddress && showBilling &&
          this.renderAddressFields(billingAddressTitle, 'billing')
        }
      </React.Fragment>
    );
  }

  renderAddressFields(title, type) {
    const { event, settings } = this.props;
    const country = this.state.formData[`customer.${type}.country`];
    const isRequired = settings.isAddressRequired !== false;

    const titleJsx = <h4 className="extend-form-subtitle">{title}</h4>;

    if (this.shouldUseAddressFinder()) {
      return (
        <Form.Group>
          {titleJsx}

          <AddressFinder
            id={`address-finder-input-${type}`}
            apiKey={this.props.addressFinderKey}
            country={this.props.addressFinderCountry}
            onSelect={(addr) => this.onAddressFinderSelect(type, addr)}
          />

          <Button variant="link" onClick={this.onPressDisableAddressFinder}>
            {t('cant-find-your-address', "Can't find your address?")}
          </Button>
        </Form.Group>
      );
    }

    return (
      <React.Fragment>
        {titleJsx}

        <Form.Row>
          <Col>
            <CountryInput
              field={`customer.${type}.country`}
              label={t('label.customer.address.country', 'Country')}
              initialValue={event.country}
              required={isRequired}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`customer.${type}.address1`}
              label={t('label.customer.address.address1', 'Address 1')}
              required={isRequired}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`customer.${type}.address2`}
              label={t('label.customer.address.address2', 'Address 2')}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`customer.${type}.suburb`}
              label={getSuburbLabel(country)}
              required={isRequired}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <StateInput
              field={`customer.${type}.state`}
              label={getStateLabel(country)}
              country={country}
              required={isRequired}
            />
          </Col>
          <Col>
            <PostcodeInput
              field={`customer.${type}.postcode`}
              label={getPostcodeLabel(country)}
              country={country}
              required={isRequired}
            />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderExtendForm() {
    return (
      <FormContext.Provider value={this.state}>
        {this.renderWaveSelect()}
        {this.renderAddOns()}
        {this.renderOptIn()}
        {this.renderExtendFields()}
      </FormContext.Provider>
    );
  }

  renderWaveSelect() {
    const { waveOptions } = this.props;

    if (waveOptions.length <= 1) return;

    return (
      <SimpleSelectInput
        field="waveProductId"
        label={t('label.wave', 'Wave')}
        options={waveOptions}
        placeholder={t('label.select', 'Select')}
        required={true}
      />
    );
  }

  renderAddOns() {
    return this.props.addOns.map(addOn =>
      <CheckboxInput
        key={addOn.offerId}
        field={`addOns.${addOn.offerId}`}
        label={t(`label.addOn.${addOn.offerId}`, addOn.name)}
      />
    );
  }

  renderOptIn() {
    const { settings } = this.props;
    if (settings.showOptIn === false) return null;

    return (
      <CheckboxInput
        field="customer.optin"
        label={settings.optInText || t('label.optIn', 'Sign up for our newsletter')}
        initialValue={settings.preTickOptIn}
      />
    );
  }

  renderExtendFields() {
    const { extendFields } = this.props;

    return extendFields.map(field =>
      <Form.Row key={field.columnKey}>
        <Col>
          {this.renderExtendField(field)}
        </Col>
      </Form.Row>
    );
  }

  renderExtendField = (field) => {
    switch (field.type) {
      case 'text':        return this.renderTextField(field);
      case 'textarea':    return this.renderTextAreaField(field);
      case 'number':      return this.renderNumberField(field);
      case 'select':      return this.renderSelectField(field);
      case 'checkbox':    return this.renderCheckboxField(field);
      case 'phonenumber': return this.renderPhoneField(field);
      case 'date':        return this.renderDateField(field);
      case 'checkboxs':   return this.renderCheckboxesField(field);
      case 'radio':       return this.renderRadioField(field);
      case 'acceptterms': return this.renderAcceptTermsField(field);
      
      default: throw new Error(`Extend field type not supported: ${field.type}`);
    }
  };

  renderTextField(field) {
    return (
      <TextInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        required={field.required}
      />
    );
  }

  renderTextAreaField(field) {
    return (
      <TextAreaInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        required={field.required}
      />
    );
  }

  renderNumberField(field) {
    return (
      <NumberInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        required={field.required}
      />
    );
  }

  renderSelectField(field) {
    return (
      <SimpleSelectInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        options={this.translateOptions(field.options)}
        required={field.required}
      />
    );
  }

  renderCheckboxField(field) {
    return (
      <CheckboxInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        explanation={t(`explanation.extendForm.${field.columnKey}`, field.explanation)}
        required={field.required}
      />
    );
  }

  renderPhoneField(field) {
    return (
      <PhoneInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        required={field.required}
      />
    );
  }

  renderDateField(field) {
    return (
      <DateInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        required={field.required}
      />
    );
  }

  renderCheckboxesField(field) {
    return (
      <CheckboxesInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        options={field.options}
        explanation={t(`explanation.extendForm.${field.columnKey}`, field.explanation)}
        required={field.required}
      />
    );
  }

  renderRadioField(field) {
    return (
      <RadioGroupInput
        field={`extendForm.${field.columnKey}`}
        label={t(`label.extendForm.${field.columnKey}`, field.label)}
        options={field.options}
        explanation={t(`explanation.extendForm.${field.columnKey}`, field.explanation)}
        required={field.required}
      />
    );
  }

  renderAcceptTermsField(field) {
    return (
      <div>
        <div
          className="terms-html"
          dangerouslySetInnerHTML={{ __html: field.html }}
        />

        {this.renderCheckboxField(field)}
      </div>
    );
  }

  renderDone() {
    const { layout, index } = this.props;
    const { firstName, lastName } = this.props.participant.customer;

    const title = <span>{t('detailsPanel.doneTitle', 'Registration Details for')} {firstName}</span>;

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

          <p>{firstName} {lastName}</p>
          <Button onClick={this.onClickEdit}>{t('btn.edit', 'Edit')}</Button>

        </PanelBody>
      </PanelContainer>
    );
  }

  getExtendField(columnKey) {
    return this.props.extendFields.find(field => field.columnKey === columnKey);
  }

  getExtendFieldLabel(columnKey) {
    const field = this.getExtendField(columnKey);
    return t(`label.extendForm.${field.columnKey}`, field.label);
  }

  getExtendFieldExplanation(columnKey) {
    const field = this.getExtendField(columnKey);
    return field ? field.explanation : '';
  }

  getExtendFieldOptions(columnKey) {
    const field = this.getExtendField(columnKey);
    return field ? field.options : [];
  }

  getDob() {
    const { formData } = this.state;

    const day   = formData['customer.dateOfBirthDay'];
    const month = formData['customer.dateOfBirthMonth'];
    const year  = formData['customer.dateOfBirthYear'];
    
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  getSubmitBtnText() {
    return t('btn.next', 'Next');
  }

  validateRequired(field, formData, errors, message) {
    if (!formData[field]) {
      errors.push({
        field: field,
        message: message || t('validation.required', 'This is a required field'),
      });
    }
  }

  validateEmail(field, formData, errors) {
    // NOTE: giant ugly regex from: https://emailregex.com/
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = regex.test(formData[field]);
    if (!isValid) {
      errors.push({
        field: field,
        message: t('validation.email', 'Please enter a valid email'),
      });
    }
  }

  validatePhone(field, formData, errors) {
    const phone = formData[field];
    if (!phone || phone.length < 10 || phone.length > 14) {
      errors.push({
        field: field,
        message: t('validation.phone', 'Please enter a valid phone number'),
      });
    }
  }

  validateUniqueEmergencyNumber(emergencyPhoneField, customerPhoneField, formData, errors, message) {
    if (formData[emergencyPhoneField] === formData[customerPhoneField]) {
      errors.push({
        field: emergencyPhoneField,
        message: message || t('validation.phone-unique', 'Emergency phone number needs to be different to your mobile number'),
      });
    }
  }

  validateDob({ field, dob, eventDate, minAge, maxAge, errors }) {
    if (minAge && eventDate) {
      const turnsMinAge = new Date(dob.getFullYear() + minAge, dob.getMonth(), dob.getDate());
      if (turnsMinAge > eventDate) {
        errors.push({
          field: field,
          message: t('validation.age-too-young', 'You must be older than {{age}} on the day of the event', { age: minAge }),
        });
      }
    }

    if (maxAge && eventDate) {
      const turnsMaxAge = new Date(dob.getFullYear() + maxAge, dob.getMonth(), dob.getDate());
      if (turnsMaxAge < eventDate) {
        errors.push({
          field: field,
          message: t('validation.age-too-old', 'You must be younger than {{age}} on the day of the event', { age: maxAge }),
        });
      }
    }
  }

  translateOptions(options) {
    return options.map(option => ({
      value: option.value,
      label: t(`option.${option.label}`, option.label),
    }));
  }
}
