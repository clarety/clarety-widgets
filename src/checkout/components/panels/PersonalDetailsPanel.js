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
                <TextInput field="customer.homePhone" placeholder="Home Phone" />
              </Col>
              <Col>
                <TextInput field="customer.workPhone" placeholder="Work Phone" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.mobilePhone" placeholder="Mobile Phone" />
              </Col>
              <Col>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>Date of Birth *</Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.dobDay" placeholder="DD" />
              </Col>
              <Col>
                <TextInput field="customer.dobMonth" placeholder="MM" />
              </Col>
              <Col>
                <TextInput field="customer.dobYear" placeholder="YYYY" />
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
    const phone = formData['customer.homePhone'] || formData['customer.workPhone'] || formData['customer.mobilePhone'];

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
  };
};

const actions = {
  updateFormData: updateFormData,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions)(_PersonalDetailsPanel);
