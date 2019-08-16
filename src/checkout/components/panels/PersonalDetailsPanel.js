import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, PhoneInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { updateFormData, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PersonalDetailsPanel extends BasePanel {
  onPressContinue = event => {
    event.preventDefault();

    if (this.validate()) {
      this.props.updateFormData(this.state.formData);
      this.props.nextPanel();
    }
  };

  validate() {
    const errors = [];

    this.validateRequired('customer.firstName', errors);
    this.validateRequired('customer.lastName', errors);

    // TODO: update this once we're using a proper
    // dob input component, instead of a text input...
    this.validateRequired('customer.dateOfBirthDay', errors);
    this.validateRequired('customer.dateOfBirthMonth', errors);
    this.validateRequired('customer.dateOfBirthYear', errors);

    this.validateRequired('sale.source', errors);

    this.setState({ errors });
    return errors.length === 0;
  }

  componentDidUpdate(prevProps) {
    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }
  }

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

    this.setState({ formData });
  }

  renderWait() {
    return (
      <WaitPanelHeader number="2" title="Personal Details" />
    );
  }

  renderEdit() {
    return (
      <div className="panel">
        <EditPanelHeader number="2" title="Personal Details" />
        
        <FormContext.Provider value={this.state}>
          <Form onSubmit={this.onPressContinue}>
            <Form.Row>
              <Col>
                <TextInput field="customer.firstName" placeholder="First Name *" />
              </Col>
              <Col>
                <TextInput field="customer.lastName" placeholder="Last Name *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <PhoneInput field="customer.phone1" placeholder="Home Phone" />
              </Col>
              <Col>
                <PhoneInput field="customer.phone2" placeholder="Work Phone" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <PhoneInput field="customer.mobile" placeholder="Mobile Phone" />
              </Col>
              <Col>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>Date of Birth *</Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.dateOfBirthDay" placeholder="DD" />
              </Col>
              <Col>
                <TextInput field="customer.dateOfBirthMonth" placeholder="MM" />
              </Col>
              <Col>
                <TextInput field="customer.dateOfBirthYear" placeholder="YYYY" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="sale.source" placeholder="How did you hear about us? *" />
              </Col>
            </Form.Row>

            <div className="text-right mt-3">
              <Button title="Continue" type="submit" />
            </div>
          </Form>
        </FormContext.Provider>
      </div>
    );
  }

  renderDone() {
    const { formData } = this.state;
    const firstName = formData['customer.firstName'];
    const lastName = formData['customer.lastName'];
    const phone = formData['customer.phone1'] || formData['customer.phone2'] || formData['customer.mobile'];

    const title = `${firstName} ${lastName}, ${phone}`;

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
    customer: state.login.customer,
  };
};

const actions = {
  updateFormData: updateFormData,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_PersonalDetailsPanel);
