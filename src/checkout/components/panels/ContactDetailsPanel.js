import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput, CheckboxInput } from 'checkout/components';
import { updateFormData, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _ContactDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      // TODO: check if email has account
      // TODO: show password input
      // TODO: show create account checkbox
      this.props.updateFormData(this.state.formData);
      this.props.nextPanel();
    }
  };

  validate() {
    const errors = [];
    this.setState({ errors });

    const email = this.state.formData['customer.email'];
    
    if (!email) {
      errors.push({
        field: 'customer.email',
        message: 'Please enter your email address',
      });
    }

    // TODO: check that email is valid.

    if (errors.length === 0) {
      return true;
    } else {
      this.setState({ errors });
      return false;
    }
  }

  renderWait() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>1. Contact Details</h2>
        <hr />
      </div>
    );
  }

  renderEdit() {
    return (
      <div>
        <h2>1. Contact Details</h2>
        <hr />

        <FormContext.Provider value={this.state}>
          <Form>
            <Form.Row>
              <Col>
                <TextInput field="customer.email" type="email" placeholder="Email *" />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <CheckboxInput field="customer.subscribeOptIn" label="Keep me up to date on news and exclusive offers" />
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const email = this.state.formData['customer.email'];

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>1.</h2> {email} <Button onClick={this.onPressEdit}>Edit</Button>
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

export const ContactDetailsPanel = connect(mapStateToProps, actions)(_ContactDetailsPanel);
