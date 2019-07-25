import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { TextInput, DobInput, CheckboxInput, SelectInput, GenderInput, PhoneInput } from 'registrations/components';
import { setDetails, resetDetails, pushNextDetailsPanel } from 'registrations/actions';
import { getExtendFields } from 'registrations/selectors';
import { FormContext } from 'registrations/utils';

export class _DetailsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customerFormContext: {
        formData: { ...props.participant.customer },
        onChange: this.onCustomerFormChange,
      },
      extendFormContext: {
        formData: { ...props.participant.extendForm },
        onChange: this.onExtendFormChange,
      },
    };
  }

  onClickNext = () => {
    const { participantIndex, setDetails, pushNextDetailsPanel } = this.props;
    const { customerFormContext, extendFormContext } = this.state;
    setDetails(participantIndex, customerFormContext.formData, extendFormContext.formData);
    pushNextDetailsPanel(participantIndex + 1);
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
      <Container>
        <FormattedMessage id="detailsPanel.editTitle" values={{ firstName }} tagName="h2" />

        <Row className="mt-5">
          <Col lg={6}>
            <FormattedMessage id="detailsPanel.customerFormTitle" tagName="h4" />
            {this.renderCustomerForm()}
          </Col>
          <Col lg={6}>
            <FormattedMessage id="detailsPanel.extendFormTitle" tagName="h4" />
            {this.renderExtendForm()}
          </Col>
        </Row>
        
        <Button onClick={this.onClickNext}>
          <FormattedMessage id="btn.next" />
        </Button>
      </Container>
    );
  }

  renderCustomerForm() {
    return (
      <FormContext.Provider value={this.state.customerFormContext}>
        <Form className="panel-body">
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
              <GenderInput field="gender" />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <DobInput
                dayField="dateOfBirthDay"
                monthField="dateOfBirthMonth"
                yearField="dateOfBirthYear"
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <PhoneInput field="phone" />
            </Col>
          </Form.Row>
        </Form>
      </FormContext.Provider>
    );
  }

  renderExtendForm() {
    return (
      <FormContext.Provider value={this.state.extendFormContext}>
        <Form className="panel-body">
          {this.props.extendFields.map(field =>
            <Form.Row key={field.columnKey}>
              <Col>
                {this.renderExtendField(field)}
              </Col>
            </Form.Row>
          )}
        </Form>
      </FormContext.Provider>
    );
  }

  renderExtendField = field => {
    switch (field.type) {
      case 'select':      return <SelectInput field={field.columnKey} options={field.options} />;
      case 'text':        return <TextInput field={field.columnKey} />;
      case 'phonenumber': return <PhoneInput field={field.columnKey} />;
      case 'checkbox':    return <CheckboxInput field={field.columnKey} />;
      
      default: throw new Error(`Extend field type not supported: ${field.type}`);
    }
  };

  renderDone() {
    const { firstName, lastName, email } = this.props.participant.customer;

    return (
      <Container>
        <FormattedMessage id="detailsPanel.doneTitle" values={{ firstName }} tagName="h4" />

        <p className="lead">
          <b>Name:</b> {firstName} {lastName}<br />
          <b>Email:</b> {email}<br />
        </p>

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
    participant: state.panelData.participants[participantIndex],
    extendFields: getExtendFields(state),
    errors: state.registration.errors,
  };
};

const actions = {
  setDetails: setDetails,
  resetDetails: resetDetails,
  pushNextDetailsPanel: pushNextDetailsPanel,
};

export const connectDetailsPanel = Component => connect(mapStateToProps, actions)(Component);
export const DetailsPanel = connectDetailsPanel(_DetailsPanel);
