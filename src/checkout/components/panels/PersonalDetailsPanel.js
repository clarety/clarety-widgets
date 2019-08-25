import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, PhoneInput, DobInput, Button } from 'checkout/components';
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

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
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

    if (foundError) {
      const { index, editPanel } = this.props;
      editPanel(index);
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
    customer: state.cart.customer,
    errors: state.errors,
  };
};

const actions = {
  updateFormData: updateFormData,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_PersonalDetailsPanel);
