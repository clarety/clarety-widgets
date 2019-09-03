import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { TextInput, PhoneInput, DobInput, Button } from 'shared/components/inputs';
import { BasePanel, WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, nextPanel, editPanel, validatePersonalDetails } from 'checkout/actions';

class _PersonalDetailsPanel extends BasePanel {
  onPressContinue = event => {
    event.preventDefault();

    const { validate, nextPanel } = this.props;
    validate({ onSuccess: () => nextPanel() });
  };

  renderWait() {
    return (
      <WaitPanelHeader number="2" title="Personal Details" />
    );
  }

  renderEdit() {
    const { isBusy } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number="2" title="Personal Details" />
        
        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          <Form onSubmit={this.onPressContinue}>
            <Form.Row>
              <Col sm={6}>
                <TextInput field="customer.firstName" placeholder="First Name *" />
              </Col>
              <Col sm={6}>
                <TextInput field="customer.lastName" placeholder="Last Name *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col sm={6}>
                <PhoneInput field="customer.phone1" placeholder="Home Phone" />
              </Col>
              <Col sm={6}>
                <PhoneInput field="customer.phone2" placeholder="Work Phone" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col sm={6}>
                <PhoneInput field="customer.mobile" placeholder="Mobile Phone" />
              </Col>
              <Col sm={6}>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>Date of Birth *</Col>
            </Form.Row>

            <DobInput
              field="customer.dateOfBirth"
              dayField="customer.dateOfBirthDay"
              monthField="customer.dateOfBirthMonth"
              yearField="customer.dateOfBirthYear"
            />

            <Form.Row>
              <Col>
                <TextInput field="sale.source" placeholder="How did you hear about us? *" />
              </Col>
            </Form.Row>

            <div className="text-right mt-3">
              <Button title="Continue" type="submit" />
            </div>
          </Form>
        </BlockUi>
      </div>
    );
  }

  renderDone() {
    const { formData } = this.props;
    const firstName = formData['customer.firstName'];
    const lastName = formData['customer.lastName'];
    const phone = formData['customer.phone1'] || formData['customer.phone2'] || formData['customer.mobile'];

    let title = `${firstName} ${lastName}`;
    if (phone) title += `, ${phone}`;

    return (
      <DonePanelHeader
        number="2"
        title={title}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
    customer: state.cart.customer,
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  nextPanel: nextPanel,
  editPanel: editPanel,
  validate: validatePersonalDetails,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions)(_PersonalDetailsPanel);
