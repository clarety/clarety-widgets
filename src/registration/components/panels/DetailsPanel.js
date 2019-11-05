import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext, parseNestedElements } from 'shared/utils';
import { TextInput, EmailInput, DobInput, CheckboxInput, SimpleSelectInput, PhoneInput } from 'registration/components';
import { getGenderOptions, scrollIntoView } from 'registration/utils';

export class _DetailsPanel extends BasePanel {
  ref = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onFormChange,
    };
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    const { participant } = this.props;

    if (participant && participant.errors !== prevProps.participant.errors) {
      this.setState({ errors: participant.errors });
    }

    if (participant && participant.customer !== prevProps.participant.customer) {
      this.prefillCustomerFormData(participant.customer);
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
      const addOns = this.getSelectedAddOns(formData);
      this.addAddOnsToCart(addOns);
      setWaveInCart(participantIndex, formData.waveProductId);

      // Update partcipant.
      setDetails(
        participantIndex,
        formData.customer,
        formData.extendForm,
        formData.waveProductId,
        addOns,
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
      }
    }));
  }

  prefillCustomerFormData(customer) {
    const formData = {};

    formData['customer.firstName']        = customer.firstName;
    formData['customer.lastName']         = customer.lastName;
    formData['customer.email']            = customer.email;
    formData['customer.mobile']           = customer.mobile;
    formData['customer.gender']           = customer.gender;
    formData['customer.dateOfBirthDay']   = customer.dateOfBirthDay;
    formData['customer.dateOfBirthMonth'] = customer.dateOfBirthMonth;
    formData['customer.dateOfBirthYear']  = customer.dateOfBirthYear;

    if (customer.billing) {
      formData['customer.billing.address1'] = customer.billing.address1;
      formData['customer.billing.address2'] = customer.billing.address2;
      formData['customer.billing.suburb']   = customer.billing.suburb;
      formData['customer.billing.state']    = customer.billing.state;
      formData['customer.billing.postcode'] = customer.billing.postcode;
      formData['customer.billing.country']  = customer.billing.country;
    }

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        ...formData,
      }
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
      formData['customer.billing.address1'] = firstParticipant.customer.billing.address1;
      formData['customer.billing.address2'] = firstParticipant.customer.billing.address2;
      formData['customer.billing.suburb']   = firstParticipant.customer.billing.suburb;
      formData['customer.billing.state']    = firstParticipant.customer.billing.state;
      formData['customer.billing.postcode'] = firstParticipant.customer.billing.postcode;
      formData['customer.billing.country']  = firstParticipant.customer.billing.country;
    }
  }

  getSelectedAddOns(formData) {
    return Object.keys(formData.addOns || {}).filter(offerId => !!formData.addOns[offerId]);
  }

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { eventDate, minAge, maxAge, settings, waveOptions } = this.props;
    const { formData } = this.state;

    this.validateRequired('customer.firstName', formData, errors);
    this.validateRequired('customer.lastName', formData, errors);
    this.validateEmail('customer.email', formData, errors);
    this.validateRequired('customer.gender', formData, errors);
    this.validateRequired('customer.dateOfBirthDay', formData, errors);
    this.validateRequired('customer.dateOfBirthMonth', formData, errors);
    this.validateRequired('customer.dateOfBirthYear', formData, errors);
    this.validatePhone('customer.mobile', formData, errors);

    this.validateDob({
      field: 'customer.dateOfBirth',
      dob: this.getDob(),
      eventDate: eventDate,
      minAge: minAge,
      maxAge: maxAge,
      errors: errors,
    });

    if (settings.showAddress) {
      this.validateRequired('customer.billing.address1', formData, errors);
      this.validateRequired('customer.billing.suburb', formData, errors);
      this.validateRequired('customer.billing.state', formData, errors);
      this.validateRequired('customer.billing.postcode', formData, errors);
      this.validateRequired('customer.billing.country', formData, errors);
    }

    if (waveOptions.length > 1)  {
      this.validateRequired('waveProductId', formData, errors);
    }
  }

  onSubmitForm() {
    // Override in subclass.
  }

  addAddOnsToCart(addOns) {
    const { addToCart, participantIndex } = this.props;

    addOns.forEach(offerId => {
      const offer = this.props.addOns.find(offer => offer.offerId === offerId);

      addToCart({
        offerId: offer.offerId,
        type: 'add-on',
        price: offer.price,
        options: { participantIndex },
      });
    });
  }

  setErrors(errors) {
    const { setErrors, participantIndex } = this.props;
    setErrors(participantIndex, errors);
    scrollIntoView(this.ref);
  }

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

    return (
      <PanelContainer layout={layout} status="edit">
        <div ref={ref => this.ref = ref}>
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            intlId="detailsPanel.editTitle"
            intlValues={{
              b: text => <span className="text-highlight">{text}</span>,
              firstName: firstName,
            }}
          />

          <Form onSubmit={this.onClickNext}>

            <PanelBody layout={layout} status="edit">
              <Row className="mt-5">
                <Col lg={6}>
                  <FormattedMessage id="detailsPanel.customerFormTitle">
                    {txt => <h4 className="mb-4">{txt}</h4>}
                  </FormattedMessage>
                  {this.renderCustomerForm()}
                </Col>
                <Col lg={6}>
                  <FormattedMessage id="detailsPanel.extendFormTitle">
                    {txt => <h4 className="mb-4">{txt}</h4>}
                  </FormattedMessage>
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

            <Button type="submit">
              <FormattedMessage id="btn.next" />
            </Button>
          </Form>
        </div>
      </PanelContainer>
    );
  }

  renderCustomerForm() {
    const { isPrefilled, appSettings, settings, participantIndex } = this.props;
    const { formData } = this.state;

    const genderOptions = this.translateOptions(
      getGenderOptions(appSettings)
    );

    const showAutofill = participantIndex !== 0;
    const showEmail   = !formData['autofill.email'];
    const showMobile  = !formData['autofill.mobile'];
    const showAddress = !formData['autofill.address'];

    return (
      <FormContext.Provider value={this.state}>
        <Form.Row>
          <Col md={6}><TextInput field="customer.firstName" disabled={isPrefilled} required /></Col>
          <Col md={6}><TextInput field="customer.lastName" disabled={isPrefilled} required /></Col>
        </Form.Row>

        {showAutofill &&
          <Form.Row>
            <Col>
              <CheckboxInput field="autofill.email" label="Use email from first participant?" />
            </Col>
          </Form.Row>
        }

        {showEmail &&
          <Form.Row>
            <Col>
              <EmailInput field="customer.email" disabled={isPrefilled} required />
            </Col>
          </Form.Row>
        }

        <Form.Row>
          <Col>
            <SimpleSelectInput field="customer.gender" options={genderOptions} required />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <DobInput
              field="customer.dateOfBirth"
              dayField="customer.dateOfBirthDay"
              monthField="customer.dateOfBirthMonth"
              yearField="customer.dateOfBirthYear"
              required
            />
          </Col>
        </Form.Row>

        {showAutofill &&
          <Form.Row>
            <Col>
              <CheckboxInput field="autofill.mobile" label="Use mobile from first participant?" />
            </Col>
          </Form.Row>
        }

        {showMobile &&
          <Form.Row>
            <Col>
              <PhoneInput field="customer.mobile" required />
            </Col>
          </Form.Row>
        }

        {showAutofill &&
          <Form.Row>
            <Col>
              <CheckboxInput field="autofill.address" label="Use address from first participant?" />
            </Col>
          </Form.Row>
        }

        {settings.showAddress && showAddress &&
          <React.Fragment>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.address1" placeholder="Address 1 *" required />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.address2" placeholder="Address 2" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.suburb" placeholder="Suburb *" required />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.state" placeholder="City *" required />
              </Col>
              <Col>
                <TextInput field="customer.billing.postcode" placeholder="Postcode *" type="number" required />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.country" placeholder="Country *" required />
              </Col>
            </Form.Row>

          </React.Fragment>
        }

      </FormContext.Provider>
    );
  }

  renderExtendForm() {
    return (
      <FormContext.Provider value={this.state}>
        {this.renderWaveSelect()}
        {this.renderAddOns()}
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
        options={waveOptions}
        placeholder="Select Wave"
        required={true}
      />
    );
  }

  renderAddOns() {
    return this.props.addOns.map(addOn =>
      <CheckboxInput
        key={addOn.offerId}
        field={`addOns.${addOn.offerId}`}
        label={addOn.name}
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
      case 'select':      return <SimpleSelectInput field={`extendForm.${field.columnKey}`} options={this.translateOptions(field.options)} required={field.required} />;
      case 'text':        return <TextInput field={`extendForm.${field.columnKey}`} required={field.required} />;
      case 'phonenumber': return <PhoneInput field={`extendForm.${field.columnKey}`} required={field.required} />;
      case 'checkbox':    return <CheckboxInput field={`extendForm.${field.columnKey}`} required={field.required} />;

      // TODO:
      case 'radio':       return null;
      case 'title':       return null;
      
      default: throw new Error(`Extend field type not supported: ${field.type}`);
    }
  };

  renderDone() {
    const { layout, index } = this.props;
    const { firstName } = this.props.participant.customer;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          intlId="detailsPanel.doneTitle"
          intlValues={{ firstName }}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>
        </PanelBody>
      </PanelContainer>
    );
  }

  getExtendFieldOptions(columnKey) {
    const field = this.props.extendFields.find(
      field => field.columnKey === columnKey
    );

    return field ? field.options : [];
  }

  getDob() {
    const { formData } = this.state;

    const day   = formData['customer.dateOfBirthDay'];
    const month = formData['customer.dateOfBirthMonth'];
    const year  = formData['customer.dateOfBirthYear'];
    
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  validateRequired(field, formData, errors, message) {
    const { intl } = this.props;
    if (!formData[field]) {
      message = message || intl.formatMessage({ id: 'validation.required' });
      errors.push({ field: field, message: message });
    }
  }

  validateEmail(field, formData, errors) {
    const { intl } = this.props;
    // NOTE: giant ugly regex from: https://emailregex.com/
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = regex.test(formData[field]);
    if (!isValid) {
      const message = intl.formatMessage({ id: 'validation.email' });
      errors.push({ field: field, message: message });
    }
  }

  validatePhone(field, formData, errors) {
    const { intl } = this.props;
    const phone = formData[field];
    if (!phone || phone.length < 10 || phone.length > 14) {
      const message = intl.formatMessage({ id: 'validation.phone' });
      errors.push({ field: field, message: message });
    }
  }

  validateDob({ field, dob, eventDate, minAge, maxAge, errors }) {
    const { intl, participant } = this.props;
    const message = intl.formatMessage({ id: `validation.age.${participant.type}` });

    if (minAge && eventDate) {
      const turnsMinAge = new Date(dob.getFullYear() + minAge, dob.getMonth(), dob.getDate());
      if (turnsMinAge > eventDate) {
        errors.push({ 'field': field, 'message': message });
      }
    }

    if (maxAge && eventDate) {
      const turnsMaxAge = new Date(dob.getFullYear() + maxAge, dob.getMonth(), dob.getDate());
      if (turnsMaxAge < eventDate) {
        errors.push({ 'field': field, 'message': message });
      }
    }
  }

  translateOptions(options) {
    const { intl } = this.props;

    return options.map(option => ({
      value: option.value,
      label: intl.formatMessage({ id: `option.${option.label}` }),
    }));
  }
}

export const DetailsPanel = injectIntl(_DetailsPanel, { forwardRef: true });
DetailsPanel.name = 'DetailsPanel';
