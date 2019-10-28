import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext } from 'shared/utils';
import { TextInput, EmailInput, DobInput, CheckboxInput, SimpleSelectInput, PhoneInput } from 'registration/components';
import { getGenderOptions, scrollIntoView } from 'registration/utils';

export const DetailsPanel = injectIntl(class extends BasePanel {
  ref = React.createRef();

  constructor(props) {
    super(props);

    // We can't populate state without a participant.
    if (!props.participant) return;
    
    this.state = {
      customerFormContext: {
        formData: this.getCustomerFormData(props.participant.customer),
        errors: [],
        onChange: this.onCustomerFormChange,
      },
      extendFormContext: {
        formData: { ...props.participant.extendForm },
        errors: [],
        onChange: this.onExtendFormChange,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.participant !== this.props.participant) {
      this.setState({
        customerFormContext: {
          ...this.state.customerFormContext,
          formData: this.getCustomerFormData(this.props.participant.customer),
          errors: this.props.participant.errors || [],
        },
        extendFormContext: {
          ...this.state.extendFormContext,
          formData: {
            ...this.props.participant.extendForm,
          },
          errors: this.props.participant.errors || [],
        },
      });
    }
  }

  getCustomerFormData(customer) {
    if (!customer) return {};

    const formData = {
      firstName:        customer.firstName,
      lastName:         customer.lastName,
      email:            customer.email,
      mobile:           customer.mobile,
      gender:           customer.gender,
      dateOfBirthDay:   customer.dateOfBirthDay,
      dateOfBirthMonth: customer.dateOfBirthMonth,
      dateOfBirthYear:  customer.dateOfBirthYear,
    };

    if (customer.billing) {
      formData['billing.address1'] = customer.billing.address1;
      formData['billing.address2'] = customer.billing.address2;
      formData['billing.suburb']   = customer.billing.suburb;
      formData['billing.state']    = customer.billing.state;
      formData['billing.postcode'] = customer.billing.postcode;
      formData['billing.country']  = customer.billing.country;
    }

    return formData;
  }

  onClickNext = async event => {
    event.preventDefault();

    const { nextPanel, setDetails, participantIndex } = this.props;
    const { customerFormContext, extendFormContext } = this.state;

    if (this.validate()) {
      this.onSubmitForm();
      setDetails(participantIndex, customerFormContext.formData, extendFormContext.formData);
      nextPanel();
    }
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  onCustomerFormChange = (field, value) => {
    this.setState(prevState => ({
      customerFormContext: {
        ...prevState.customerFormContext,
        formData: {
          ...prevState.customerFormContext.formData,
          [field]: value,
        }
      }
    }));
  }

  onExtendFormChange = (field, value) => {
    this.setState(prevState => ({
      extendFormContext: {
        ...prevState.extendFormContext,
        formData: {
          ...prevState.extendFormContext.formData,
          [field]: value,
        }
      }
    }));
  };

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { formData } = this.state.customerFormContext;
    const extendFormData = this.state.extendFormContext.formData;
    const { eventDate, minAge, maxAge, settings, waveOptions } = this.props;

    this.validateRequired('firstName', formData, errors);
    this.validateRequired('lastName', formData, errors);
    this.validateEmail('email', formData, errors);
    this.validateRequired('gender', formData, errors);
    this.validateRequired('dateOfBirthDay', formData, errors);
    this.validateRequired('dateOfBirthMonth', formData, errors);
    this.validateRequired('dateOfBirthYear', formData, errors);
    this.validatePhone('mobile', formData, errors);

    this.validateDob({
      field: 'dateOfBirth',
      dob: this.getDob(),
      eventDate: eventDate,
      minAge: minAge,
      maxAge: maxAge,
      errors: errors,
    });

    if (settings.showAddress) {
      this.validateRequired('billing.address1', formData, errors);
      this.validateRequired('billing.suburb', formData, errors);
      this.validateRequired('billing.state', formData, errors);
      this.validateRequired('billing.postcode', formData, errors);
      this.validateRequired('billing.country', formData, errors);
    }

    if (waveOptions.length > 1)  {
      this.validateRequired('wave', extendFormData, errors);
    }
  }

  onSubmitForm() {
    // Left empty in the base implementation,
    // but can be overridden in the instance.
  }

  setErrors(errors) {
    const { setErrors, participantIndex } = this.props;
    setErrors(participantIndex, errors);
    scrollIntoView(this.ref);
  }

  getCustomerFieldValue(field) {
    return this.state.customerFormContext.formData[field];
  }

  getExtendFieldValue(field) {
    return this.state.extendFormContext.formData[field];
  }

  reset() {
    const { resetDetails, participantIndex } = this.props;
    resetDetails(participantIndex);
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
    const { firstName } = this.state.customerFormContext.formData;

    return (
      <PanelContainer layout={layout} status="edit">
        <div ref={ref => this.ref = ref}>
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            intlId="detailsPanel.editTitle"
            intlValues={{
              firstName: <span className="text-primary">{firstName}</span>
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
    const { isPrefilled, appSettings, settings } = this.props;

    const genderOptions = this.translateOptions(
      getGenderOptions(appSettings)
    );

    return (
      <FormContext.Provider value={this.state.customerFormContext}>
        <Form.Row>
          <Col md={6}><TextInput field="firstName" disabled={isPrefilled} required /></Col>
          <Col md={6}><TextInput field="lastName" disabled={isPrefilled} required /></Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <EmailInput field="email" disabled={isPrefilled} required />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <SimpleSelectInput field="gender" options={genderOptions} required />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <DobInput
              field="dateOfBirth"
              dayField="dateOfBirthDay"
              monthField="dateOfBirthMonth"
              yearField="dateOfBirthYear"
              required
            />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <PhoneInput field="mobile" required />
          </Col>
        </Form.Row>

        {settings.showAddress &&
          <React.Fragment>

            <Form.Row>
              <Col>
                <TextInput field="billing.address1" placeholder="Address 1 *" required />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="billing.address2" placeholder="Address 2" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="billing.suburb" placeholder="Suburb *" required />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="billing.state" placeholder="City *" required />
              </Col>
              <Col>
                <TextInput field="billing.postcode" placeholder="Postcode *" type="number" required />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="billing.country" placeholder="Country *" required />
              </Col>
            </Form.Row>

          </React.Fragment>
        }

      </FormContext.Provider>
    );
  }

  renderExtendForm() {
    return (
      <FormContext.Provider value={this.state.extendFormContext}>
        {this.renderWaveSelect()}

        {this.props.extendFields.map(field =>
          <Form.Row key={field.columnKey}>
            <Col>
              {this.renderExtendField(field)}
            </Col>
          </Form.Row>
        )}
      </FormContext.Provider>
    );
  }

  renderWaveSelect() {
    const { waveOptions } = this.props;

    if (waveOptions.length <= 1) return;

    return (
      <SimpleSelectInput
        field="wave"
        options={waveOptions}
        placeholder="Select Wave"
        required={true}
      />
    );
  }

  renderExtendField = (field) => {
    switch (field.type) {
      case 'select':      return <SimpleSelectInput field={field.columnKey} options={this.translateOptions(field.options)} required={field.required} />;
      case 'text':        return <TextInput field={field.columnKey} required={field.required} />;
      case 'phonenumber': return <PhoneInput field={field.columnKey} required={field.required} />;
      case 'checkbox':    return <CheckboxInput field={field.columnKey} required={field.required} />;

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

  getDob() {
    const { dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear } = this.state.customerFormContext.formData;
    return new Date(Number(dateOfBirthYear), Number(dateOfBirthMonth) - 1, Number(dateOfBirthDay));
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
}, { forwardRef: true });

DetailsPanel.name = 'DetailsPanel';
