import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { getElementOptions } from 'shared/utils';
import { TextInput, DobInput, CheckboxInput, SelectInput, PhoneInput } from 'registrations/components';
import { setDetails, setAdditionalData, setErrors, resetDetails, pushNextDetailsPanel } from 'registrations/actions';
import { getEvent, getExtendFields } from 'registrations/selectors';
import { FormContext, scrollIntoView } from 'registrations/utils';

export class _DetailsPanel extends React.Component {
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
    this.validateRequired('mobile', formData, errors);

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

  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
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
    const genderOptions = getElementOptions('customer.gender', this.props.init);

    return (
      <FormContext.Provider value={this.state.customerFormContext}>
        <Form.Row>
          <Col md={6}><TextInput field="firstName" /></Col>
          <Col md={6}><TextInput field="lastName" /></Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <TextInput field="email" type="email" />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <SelectInput field="gender" options={genderOptions} />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <DobInput
              field="dateOfBirth"
              dayField="dateOfBirthDay"
              monthField="dateOfBirthMonth"
              yearField="dateOfBirthYear"
            />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <PhoneInput field="mobile" />
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
      case 'select':      return <SelectInput field={field.columnKey} options={field.options} required={field.required} />;
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
    if (!formData[field]) {
      errors.push({
        field: field,
        message: message || 'This is a required field.',
      });
    }
  }

  validateEmail(field, formData, errors) {
    const email = formData[field];
    const isValid = /^.+@.+\..+$/.test(email);
    if (!isValid) {
      errors.push({
        'field': field,
        'message': 'Please enter a valid email.',
      });
    }
  }

  validateDob({ field, dob, eventDate, minAge, maxAge, errors }) {
    if (minAge && eventDate) {
      const turnsMinAge = new Date(dob.getFullYear() + minAge, dob.getMonth(), dob.getDate());
      if (turnsMinAge > eventDate) {
        errors.push({
          'field': field,
          'message': `You must be ${minAge} or older on the day of the event.`,
        });
      }
    }

    if (maxAge && eventDate) {
      const turnsMaxAge = new Date(dob.getFullYear() + maxAge, dob.getMonth(), dob.getDate());
      if (turnsMaxAge < eventDate) {
        errors.push({
          'field': field,
          'message': `You must be younger than ${maxAge} on the day of the event.`,
        });
      }
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { participantIndex } = ownProps;

  const event = getEvent(state);
  const participant = state.panelData.participants[participantIndex];
  const offer = event.registrationTypes[participant.type].offers[0];

  return {
    init: state.init,
    event: event,
    participant: participant,
    extendFields: getExtendFields(state),
    eventDate: new Date(offer.ageCalculationDate),
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

export const connectDetailsPanel = Component => connect(mapStateToProps, actions)(Component);
export const DetailsPanel = connectDetailsPanel(_DetailsPanel);
