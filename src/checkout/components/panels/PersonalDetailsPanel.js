import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput } from 'checkout/components';
import { setPersonalDetails, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PersonalDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      this.props.setPersonalDetails(this.state.formData);
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
                <TextInput field="firstName" placeholder="First Name *" />
              </Col>
              <Col>
                <TextInput field="lastName" placeholder="Last Name *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="homePhone" placeholder="Home Phone" />
              </Col>
              <Col>
                <TextInput field="workPhone" placeholder="Work Phone" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="mobilePhone" placeholder="Mobile Phone" />
              </Col>
              <Col>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>Date of Birth *</Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="dobDay" placeholder="DD" />
              </Col>
              <Col>
                <TextInput field="dobMonth" placeholder="MM" />
              </Col>
              <Col>
                <TextInput field="dobYear" placeholder="YYYY" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="source" placeholder="How did you hear about us? *" />
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const { firstName, lastName, homePhone, workPhone, mobilePhone } = this.props.personalDetails;
    const phone = homePhone || workPhone || mobilePhone;

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
    personalDetails: state.data.personalDetails,
  };
};

const actions = {
  setPersonalDetails: setPersonalDetails,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const PersonalDetailsPanel = connect(mapStateToProps, actions)(_PersonalDetailsPanel);
