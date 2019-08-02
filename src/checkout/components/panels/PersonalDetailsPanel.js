import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput } from 'checkout/components';
import { updateFormData, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PersonalDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      this.props.updateFormData(this.state.formData);
      this.props.nextPanel();
    }
  };

  validate() {
    // TODO: validate fields...
    return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }
  }

  prefillCustomerData(customer) {
    this.setState({
      formData: {
        'customer.firstName':        customer.firstName,
        'customer.lastName':         customer.lastName,
        'customer.phone1':           customer.phone1,
        'customer.phone2':           customer.phone2,
        'customer.mobile':           customer.mobile,
        'customer.dateOfBirthDay':   customer.dateOfBirthDay,
        'customer.dateOfBirthMonth': customer.dateOfBirthMonth,
        'customer.dateOfBirthYear':  customer.dateOfBirthYear,
      }
    })
  }

  renderWait() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>2. Personal Details</h2>
        <hr />
      </div>
    );
  }

  renderEdit() {
    return (
      <div>
        <h2>2. Personal Details</h2>
        <hr />
        
        <FormContext.Provider value={this.state}>
          <Form>
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
                <TextInput field="customer.phone1" placeholder="Home Phone" />
              </Col>
              <Col>
                <TextInput field="customer.phone2" placeholder="Work Phone" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.mobile" placeholder="Mobile Phone" />
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
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const { formData } = this.state;
    const firstName = formData['customer.firstName'];
    const lastName = formData['customer.lastName'];
    const phone = formData['customer.phone1'] || formData['customer.phone2'] || formData['customer.mobile'];

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>2.</h2> {firstName} {lastName}, {phone} <Button onClick={this.onPressEdit}>Edit</Button>
        <hr />
      </div>
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

export const PersonalDetailsPanel = connect(mapStateToProps, actions)(_PersonalDetailsPanel);
