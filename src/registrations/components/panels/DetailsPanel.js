import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { getElementOptions } from 'shared/utils';
import { TextInput, DobInput, CheckboxInput, SelectInput, PhoneInput } from 'checkout/components';
import { pushNextDetailsPanel, validateParticipantDetails } from 'registrations/actions';
import { getExtendFields } from 'registrations/selectors';
import { scrollIntoView } from 'registrations/utils';

export class _DetailsPanel extends React.Component {
  ref = React.createRef();

  onClickNext = event => {
    event.preventDefault();

    const { participantIndex, pushNextDetailsPanel, validate, intl } = this.props;

    validate({
      participantIndex: participantIndex,
      intl: intl,
      onSuccess: () => {
        this.onSubmitForm();
        pushNextDetailsPanel(participantIndex + 1);
      },
      onFailure: () => {
        scrollIntoView(this.ref);
      },
    });
  };

  onClickEdit = () => {
    this.props.popToPanel();
  };

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

  return {
    settings: state.settings,
    participantIndex: participantIndex,
    participantType: participantType,
    extendFields: getExtendFields(state),
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  pushNextDetailsPanel: pushNextDetailsPanel,
  validate: validateParticipantDetails,
};

export const connectDetailsPanel = Component => injectIntl(connect(mapStateToProps, actions)(Component));
export const DetailsPanel = connectDetailsPanel(_DetailsPanel);
