import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { customerSearch, login, createAccount, updateFormData, nextPanel, editPanel, emailStatuses } from 'checkout/actions';
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

  onPressShowCreateAccountForm = () => {
    this.setState({ shouldCreateAccount: true });
  };

  onPressCreateAccount = () => {
    if (this.validate()) {
      const { firstName, lastName, email, password } = this.state.formData;
      this.props.createAccount(firstName, lastName, email, password);
    }
  };

  onPressGuestCheckout = () => {
    this.props.updateFormData({ 'customer.email': this.state.formData.email });
    this.props.nextPanel();
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
      <WaitPanelHeader number="1" title="Contact Details" />
    );
  }

  renderEdit() {
    return (
      <div className="panel">
        <EditPanelHeader number="1" title="Contact Details" />

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

        <div className="text-right">
          <Button
            title="Continue"
            onClick={this.onPressCheckEmail}
            isBusy={this.props.isBusy}
          />
        </div>
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

        <div className="text-right">
          <Button
            title="Login"
            onClick={this.onPressLogin}
            isBusy={this.props.isBusy}
          />
        </div>

      </FormContext.Provider>
    );
  }

  renderNoAccountForm() {
    if (this.state.shouldCreateAccount) return this.renderCreateAccountForm();

    return (
      <FormContext.Provider value={this.state}>
        <Form>
          <Form.Row>
            <Col>
              <TextInput field="email" type="email" placeholder="Email *" />
            </Col>
          </Form.Row>
        </Form>

        <p>There is no account associated with this email, would you like to create one or checkout as a guest?</p>
        <div className="text-right">
          <Button title="Create Account" onClick={this.onPressShowCreateAccountForm} />
          <Button title="Guest Checkout" onClick={this.onPressGuestCheckout} />
        </div>
      </FormContext.Provider>
    );
  }

  renderCreateAccountForm() {
    return (
      <FormContext.Provider value={this.state}>
        <Form>

          <p>You already have an account, please login to continue.</p>

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
              <TextInput field="email" type="email" placeholder="Email *" />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput field="password" type="password" placeholder="Password *" />
            </Col>
          </Form.Row>

        </Form>

        <div className="text-right">
          <Button
            title="Create Account"
            onClick={this.onPressCreateAccount}
            isBusy={this.props.isBusy}
          />
        </div>

      </FormContext.Provider>
    );
  }

  renderDone() {
    const email = this.state.formData['email'];

    return (
      <DonePanelHeader
        number="1"
        title={email}
        onPressEdit={this.onPressEdit}
      />
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
  createAccount: createAccount,
  updateFormData: updateFormData,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ContactDetailsPanel = connect(mapStateToProps, actions)(_ContactDetailsPanel);
