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

    if (this.validateForm()) {
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

  validateForm() {
    // No validation in the base implementation for now,
    // but can be overridden in the instance.
    return true;
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
          <Col md={6}><TextInput field="firstName" required /></Col>
          <Col md={6}><TextInput field="lastName" required /></Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <TextInput field="email" type="email" required />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <SelectInput field="gender" options={genderOptions} required />
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
}

const mapStateToProps = (state, ownProps) => {
  const { participantIndex } = ownProps;

  return {
    init: state.init,
    event: getEvent(state),
    participant: state.panelData.participants[participantIndex],
    extendFields: getExtendFields(state),
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
