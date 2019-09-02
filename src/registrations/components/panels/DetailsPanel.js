import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { getElementOptions } from 'shared/utils';
import { TextInput, DobInput, CheckboxInput, SelectInput, PhoneInput } from 'checkout/components';
import { setAdditionalData, pushNextDetailsPanel, setErrors } from 'registrations/actions';
import { getEvent, getExtendFields } from 'registrations/selectors';
import { scrollIntoView } from 'registrations/utils';

export class _DetailsPanel extends React.Component {
  ref = React.createRef();

  onClickNext = event => {
    event.preventDefault();

    const { participantIndex, pushNextDetailsPanel } = this.props;

    if (this.validate()) {
      this.onSubmitForm();
      pushNextDetailsPanel(participantIndex + 1);
    } else {
      scrollIntoView(this.ref);
    }
  };

  onClickEdit = () => {
    this.props.popToPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { formData, participantIndex } = this.props;
    const { eventDate, minAge, maxAge } = this.props;

    this.validateRequired(`participants[${participantIndex}].customer.firstName`, formData, errors);
    this.validateRequired(`participants[${participantIndex}].customer.lastName`, formData, errors);
    this.validateEmail(`participants[${participantIndex}].customer.email`, formData, errors);
    this.validateRequired(`participants[${participantIndex}].customer.gender`, formData, errors);
    this.validateRequired(`participants[${participantIndex}].customer.dateOfBirthDay`, formData, errors);
    this.validateRequired(`participants[${participantIndex}].customer.dateOfBirthMonth`, formData, errors);
    this.validateRequired(`participants[${participantIndex}].customer.dateOfBirthYear`, formData, errors);
    this.validateRequired(`participants[${participantIndex}].customer.mobile`, formData, errors);

    this.validateDob({
      field: `participants[${participantIndex}].customer.dateOfBirth`,
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

  getCustomerFieldValue(field) {
    const { participantIndex, formData } = this.props;
    return formData[`participants[${participantIndex}].customer.${field}`];
  }

  getExtendFieldValue(field) {
    const { participantIndex, formData } = this.props;
    return formData[`participants[${participantIndex}].extendForm.${field}`];
  }

  componentWillUnmount() {
    // TODO: reset form data.
    // resetDetails(participantIndex);
  }

  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
  }

  renderEdit() {
    const firstName = this.getCustomerFieldValue('firstName');

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
    const { participantIndex, settings } = this.props;

    let genderOptions = getElementOptions('customer.gender', settings);
    genderOptions = this.translateOptions(genderOptions);

    return (
      <React.Fragment>
        <Form.Row>
          <Col md={6}><TextInput field={`participants[${participantIndex}].customer.firstName`} required /></Col>
          <Col md={6}><TextInput field={`participants[${participantIndex}].customer.lastName`} required /></Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <TextInput field={`participants[${participantIndex}].customer.email`} type="text" required />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <SelectInput field={`participants[${participantIndex}].customer.gender`} options={genderOptions} required />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <DobInput
              field={`participants[${participantIndex}].customer.dateOfBirth`}
              dayField={`participants[${participantIndex}].customer.dateOfBirthDay`}
              monthField={`participants[${participantIndex}].customer.dateOfBirthMonth`}
              yearField={`participants[${participantIndex}].customer.dateOfBirthYear`}
              required
            />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <PhoneInput field={`participants[${participantIndex}].customer.mobile`} required />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderExtendForm() {
    return this.props.extendFields.map(field =>
      <Form.Row key={field.columnKey}>
        <Col>
          {this.renderExtendField(field)}
        </Col>
      </Form.Row>
    );
  }

  renderExtendField = extendField => {
    const { participantIndex } = this.props;
    const inputField = `participants[${participantIndex}].extendForm.${extendField.columnKey}`;

    switch (extendField.type) {
      case 'select':      return <SelectInput field={inputField} options={this.translateOptions(extendField.options)} required={extendField.required} />;
      case 'text':        return <TextInput field={inputField} required={extendField.required} />;
      case 'phonenumber': return <PhoneInput field={inputField} required={extendField.required} />;
      case 'checkbox':    return <CheckboxInput field={inputField} required={extendField.required} />;
      
      default: throw new Error(`Extend field type not supported: ${extendField.type}`);
    }
  };

  renderDone() {
    const { participantIndex, formData } = this.props;
    const firstName = formData[`participants[${participantIndex}].customer.firstName`];

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
    const { participantIndex, formData } = this.props;

    const dateOfBirthDay   = formData[`participants[${participantIndex}].customer.dateOfBirthDay`];
    const dateOfBirthMonth = formData[`participants[${participantIndex}].customer.dateOfBirthMonth`];
    const dateOfBirthYear  = formData[`participants[${participantIndex}].customer.dateOfBirthYear`];

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
    const isValid = /^.+@.+\..+$/.test(formData[field]);
    if (!isValid) {
      const message = intl.formatMessage({ id: 'validation.email' });
      errors.push({ field: field, message: message });
    }
  }

  validateDob({ field, dob, eventDate, minAge, maxAge, errors }) {
    const { intl, participantType } = this.props;
    const message = intl.formatMessage({ id: `validation.age.${participantType}` });

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
  const { participantIndex } = ownProps.panel.data;
  const participantType = state.formData[`participants[${participantIndex}].type`];

  const event = getEvent(state);
  const offer = event.registrationTypes[participantType].offers[0];
  const eventDate = new Date(offer.ageCalculationDate || event.startDate);

  return {
    settings: state.settings,
    event: event,
    participantIndex: participantIndex,
    participantType: participantType,
    extendFields: getExtendFields(state),
    eventDate: eventDate,
    minAge: Number(offer.minAgeOver),
    maxAge: Number(offer.maxAgeUnder),
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  setAdditionalData: setAdditionalData,
  pushNextDetailsPanel: pushNextDetailsPanel,
  setErrors: setErrors,
};

export const connectDetailsPanel = Component => injectIntl(connect(mapStateToProps, actions)(Component));
export const DetailsPanel = connectDetailsPanel(_DetailsPanel);
