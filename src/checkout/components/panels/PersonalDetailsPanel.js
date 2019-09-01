import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { BasePanel, TextInput, PhoneInput, DobInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, nextPanel, editPanel, panelStatuses, updateFormData, validatePersonalDetails } from 'checkout/actions';

class _PersonalDetailsPanel extends BasePanel {
  onPressContinue = event => {
    event.preventDefault();

    const { validate, nextPanel } = this.props;
    validate({ onSuccess: () => nextPanel() });
  };

  componentDidUpdate(prevProps) {
    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }

    if (this.props.errors !== prevProps.errors) {
      this.checkForErrors();
    }
  }

  checkForErrors() {
    let foundError = false;

    if (this.hasError('customer.firstName'))        foundError = true;
    if (this.hasError('customer.lastName'))         foundError = true;
    if (this.hasError('customer.phone1'))           foundError = true;
    if (this.hasError('customer.phone2'))           foundError = true;
    if (this.hasError('customer.mobile'))           foundError = true;
    if (this.hasError('customer.dateOfBirthDay'))   foundError = true;
    if (this.hasError('customer.dateOfBirthMonth')) foundError = true;
    if (this.hasError('customer.dateOfBirthYear'))  foundError = true;

    if (foundError && this.props.status !== panelStatuses.edit) {
      const { index, editPanel } = this.props;
      editPanel(index);
    }
  }

  // TODO: this shouldn't be done in the component...
  prefillCustomerData(customer) {
    let formData = {};

    if (customer) {
      formData = {
        'customer.firstName':        customer.firstName,
        'customer.lastName':         customer.lastName,
        'customer.phone1':           customer.phone1,
        'customer.phone2':           customer.phone2,
        'customer.mobile':           customer.mobile,
        'customer.dateOfBirthDay':   customer.dateOfBirthDay,
        'customer.dateOfBirthMonth': customer.dateOfBirthMonth,
        'customer.dateOfBirthYear':  customer.dateOfBirthYear,
      };
    }

    this.props.updateFormData(formData);
  }

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
  updateFormData: updateFormData,
  validate: validatePersonalDetails,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions)(_PersonalDetailsPanel);
