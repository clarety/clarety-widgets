import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, CheckboxInput, Button, EditButton } from 'checkout/components';
import { customerSearch, login, editPanel, emailStatuses } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _ContactDetailsPanel extends BasePanel {
  onPressCheckEmail = () => {
    if (this.validate()) {
      const { email } = this.state.formData;
      this.props.customerSearch(email);
    }
  };

  onPressLogin = () => {
    if (this.validate()) {
      const { email, password } = this.state.formData;
      this.props.login(email, password);
    }
  };

  validate() {
    const errors = [];
    this.setState({ errors });

    const { email } = this.state.formData;
    
    if (!email) {
      errors.push({
        field: 'email',
        message: 'Please enter your email address',
      });
    }

    // TODO: check that email is valid.

    // TODO: validate that password is not empty...

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

        {this.renderForm()}
      </div>
    );
  }

  renderForm() {
    switch (this.props.emailStatus) {
      case emailStatuses.notChecked: return this.renderEmailCheckForm();
      case emailStatuses.noAccount:  return this.renderNoAccountForm();
      case emailStatuses.hasAccount: return this.renderLoginForm();
    }
  }

  renderEmailCheckForm() {
    return (
      <FormContext.Provider value={this.state}>
        <Form>
          <Form.Row>
            <Col>
              <TextInput field="email" type="email" placeholder="Email *" />
            </Col>
          </Form.Row>
        </Form>

        <Button
          title="Continue"
          onClick={this.onPressCheckEmail}
          isBusy={this.props.isBusy}
        />
      </FormContext.Provider>
    );
  }

  renderLoginForm() {
    return (
      <FormContext.Provider value={this.state}>
        <Form>

          <p>You already have an account, please login to continue.</p>

          <Form.Row>
            <Col>
              <TextInput field="email" type="email" placeholder="Email *" />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput field="password" type="password" placeholder="Password *" />
            </Col>
          </Form.Row>

        </Form>

        <Button
          title="Login"
          onClick={this.onPressLogin}
          isBusy={this.props.isBusy}
        />

      </FormContext.Provider>
    );
  }

  renderNoAccountForm() {
    return (
      <FormContext.Provider value={this.state}>
        <Form>

          {/* TODO: No account form... */}

        </Form>

        <Button
          title="Continue"
          isBusy={this.props.isBusy}
        />

      </FormContext.Provider>
    );
  }

  renderDone() {
    const email = this.state.formData['email'];

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>1.</h2> {email} <EditButton onClick={this.onPressEdit} />
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.login.isBusy,
    emailStatus: state.login.emailStatus,
  };
};

const actions = {
  customerSearch: customerSearch,
  login: login,
  editPanel: editPanel,
};

export const ContactDetailsPanel = connect(mapStateToProps, actions)(_ContactDetailsPanel);
