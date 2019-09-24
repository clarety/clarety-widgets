import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { getElementOptions } from 'shared/utils';
import { BasePanel, TextInput, EmailInput, DobInput, CheckboxInput, SimpleSelectInput, PhoneInput } from 'registrations/components';
import { setDetails, setAdditionalData, setErrors, resetDetails, pushNextDetailsPanel } from 'registrations/actions';
import { getEvent, getExtendFields } from 'registrations/selectors';
import { FormContext, scrollIntoView } from 'registrations/utils';

export class _DetailsPanel extends BasePanel {
  ref = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      customerFormContext: {
        formData: { ...props.participant.customer },
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
    const { errors } = this.props.participant;

    if (prevProps.participant.errors !== errors) {
      this.setState({
        customerFormContext: {
          ...this.state.customerFormContext,
          errors: errors,
        },
        extendFormContext: {
          ...this.state.extendFormContext,
          errors: errors,
        },
      });
    }
  }

  onClickNext = event => {
    const { participantIndex, setDetails, pushNextDetailsPanel } = this.props;
    const { customerFormContext, extendFormContext } = this.state;

    event.preventDefault();

    if (this.validate()) {
      this.onSubmitForm();
      setDetails(participantIndex, customerFormContext.formData, extendFormContext.formData);
      pushNextDetailsPanel(participantIndex + 1);
    }
  };

  onClickEdit = () => {
    this.props.popToPanel();
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
    const { eventDate, minAge, maxAge } = this.props;

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

  componentWillUnmount() {
    const { resetDetails, participantIndex } = this.props;
    resetDetails(participantIndex);
  }

  renderEdit() {
    const { firstName } = this.state.customerFormContext.formData;

    return (
      <Container ref={ref => this.ref = ref}>
        <FormattedMessage
          id="detailsPanel.editTitle"
          tagName="h2"
          values={{
            firstName: <span className="text-primary">{firstName}</span>
          }}
        />

        <Form onSubmit={this.onClickNext}>
          <div className="panel-body">
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
          </div>

          <Button type="submit">
            <FormattedMessage id="btn.next" />
          </Button>
        </Form>
      </Container>
    );
  }

  renderCustomerForm() {
    let genderOptions = getElementOptions('customer.gender', this.props.settings);
    genderOptions = this.translateOptions(genderOptions);

    return (
      <FormContext.Provider value={this.state.customerFormContext}>
        <Form.Row>
          <Col md={6}><TextInput field="firstName" required /></Col>
          <Col md={6}><TextInput field="lastName" required /></Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <EmailInput field="email" required />
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
      </FormContext.Provider>
    );
  }

  renderExtendForm() {
    return (
      <FormContext.Provider value={this.state.extendFormContext}>
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

  renderExtendField = field => {
    switch (field.type) {
      case 'select':      return <SimpleSelectInput field={field.columnKey} options={this.translateOptions(field.options)} required={field.required} />;
      case 'text':        return <TextInput field={field.columnKey} required={field.required} />;
      case 'phonenumber': return <PhoneInput field={field.columnKey} required={field.required} />;
      case 'checkbox':    return <CheckboxInput field={field.columnKey} required={field.required} />;
      
      default: throw new Error(`Extend field type not supported: ${field.type}`);
    }
  };

  renderDone() {
    const { firstName } = this.props.participant.customer;

    return (
      <Container>
        <FormattedMessage id="detailsPanel.doneTitle" values={{ firstName }} tagName="h4" />

        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
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
}

const mapStateToProps = (state, ownProps) => {
  const { participantIndex } = ownProps;

  const event = getEvent(state);
  const participant = state.panelData.participants[participantIndex];
  const offer = event.registrationTypes[participant.type].offers[0];
  const eventDate = new Date(offer.ageCalculationDate || event.startDate);

  return {
    settings: state.settings,
    event: event,
    participant: participant,
    extendFields: getExtendFields(state),
    eventDate: eventDate,
    minAge: Number(offer.minAgeOver),
    maxAge: Number(offer.maxAgeUnder),
  };
};

const actions = {
  setDetails: setDetails,
  setAdditionalData: setAdditionalData,
  setErrors: setErrors,
  resetDetails: resetDetails,
  pushNextDetailsPanel: pushNextDetailsPanel,
};

export const connectDetailsPanel = Component => injectIntl(connect(mapStateToProps, actions)(Component));
export const DetailsPanel = connectDetailsPanel(_DetailsPanel);
