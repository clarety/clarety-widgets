import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput, CheckboxInput } from 'checkout/components';
import { setContactDetails, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _ContactDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      // TODO: check if email has account
      // TODO: show password input
      // TODO: show create account checkbox
      this.props.setContactDetails(this.state.formData);
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
                <TextInput field="email" type="email" placeholder="Email *" />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <CheckboxInput field="subscribeOptIn" label="Keep me up to date on news and exclusive offers" />
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const { contactDetails } = this.props;

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>1.</h2> {contactDetails.email} <button onClick={this.onPressEdit}>Edit</button>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    contactDetails: state.data.contactDetails,
  };
};

const actions = {
  setContactDetails: setContactDetails,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ContactDetailsPanel = connect(mapStateToProps, actions)(_ContactDetailsPanel);
