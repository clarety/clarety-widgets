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

  onClickNext = event => {
    event.preventDefault();

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

        <Form onSubmit={this.onClickNext}>
          <div className="panel-body">
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
          </div>

          <Button type="submit">
            <FormattedMessage id="btn.next" />
          </Button>
        </Form>
      </Container>
    );
  }

  renderCustomerForm() {
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
            <GenderInput field="gender" required />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <DobInput
              dayField="dateOfBirthDay"
              monthField="dateOfBirthMonth"
              yearField="dateOfBirthYear"
              required
            />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <PhoneInput field="phone" required />
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
