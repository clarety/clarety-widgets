import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { BasePanel, TextInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, hasAccount, login, logout, updateFormData, resetFormData, nextPanel, editPanel, resetPanels, emailStatuses, resetEmailStatus, updatePanelData } from 'checkout/actions';
import { getPanelData } from 'checkout/selectors';
import { FormContext } from 'checkout/utils';

class _LoginPanel extends BasePanel {
  onPressCheckEmail = event => {
    event.preventDefault();

    if (this.validate()) {
      const { email } = this.state.formData;
      this.props.hasAccount(email);
      this.props.resetFormData();
      this.props.resetPanelData();
    }
  };

  onPressLogin = event => {
    event.preventDefault();

    if (this.validate()) {
      const { email, password } = this.state.formData;
      this.props.login(email, password);
    }
  };

  onPressShowCreateAccountForm = () => {
    this.updatePanelData({ isCreatingAccount: true });
  };

  onPressCancelCreateAccount = () => {
    this.updatePanelData({ isCreatingAccount: false });
  }

  onPressCreateAccount = event => {
    event.preventDefault();

    if (this.validate()) {
      const { email, password } = this.state.formData;
      this.props.updateFormData({
        'customer.email': email,
        'customer.password': password,
      });
      this.props.nextPanel();
    }
  };

  onPressGuestCheckout = () => {
    const { email } = this.state.formData;
    this.props.updateFormData({ 'customer.email': email });
    this.props.nextPanel();
  };

  onPressLogout = () => {
    this.onChangeField('email', '');
    this.onChangeField('password', '');
    this.updatePanelData({ isCreatingAccount: false });
    this.props.resetPanels();
    this.props.resetPanelData();
    this.props.resetFormData();
    this.props.logout();
  }

  onPressStayLoggedIn = () => {
    this.props.nextPanel();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if email has been modified, and reset status.
    if (this.state.formData.email !== prevState.formData.email) {
      this.props.resetEmailStatus();
      this.props.resetPanels();
      this.onChangeField('password', '');
    }

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  validate() {
    const errors = [];

    const { emailStatus } = this.props;

    // Create Account
    if (this.props.isCreatingAccount) {
      this.validatePassword('password', errors);
    }

    // Login
    if (emailStatus === emailStatuses.hasAccount) {
      this.validateRequired('password', errors);
    }

    // Check Email
    if (emailStatus === emailStatuses.notChecked) {
      this.validateEmail('email', errors);
    }

    this.setState({ errors });
    return errors.length === 0;
  }

  resetPanelData() {
    // Clear all form data except email.
    this.setState(prevState => ({
      formData: {
        email: prevState.formData.email,
      },
    }));
  }

  renderWait() {
    return (
      <WaitPanelHeader number="1" title="Contact Details" />
    );
  }

  renderEdit() {
    const { isBusy } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number="1" title="Contact Details" />

        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          {this.renderForm()}
        </BlockUi>
      </div>
    );
  }

  renderForm() {
    if (this.props.isLoggedIn) {
      return this.renderIsLoggedInForm();
    }

    if (this.props.isCreatingAccount) {
      return this.renderCreateAccountForm();
    }

    if (this.props.emailStatus === emailStatuses.hasAccount) {
      return this.renderLoginForm();
    }

    const hasNoAccount = this.props.emailStatus === emailStatuses.noAccount;
    return this.renderEmailCheckForm(hasNoAccount);
  }

  renderEmailCheckForm(hasNoAccount) {
    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressCheckEmail}>
          <Form.Row>
            <Col>
              <TextInput field="email" type="email" placeholder="Email *" />
            </Col>
          </Form.Row>

          {hasNoAccount
            ? this.renderNoAccountButtons()
            : this.renderCheckEmailButton()
          }
        </Form>
      </FormContext.Provider>
    );
  }

  renderCheckEmailButton() {
    return (
      <div className="text-right mt-3">
        <Button title="Continue" type="submit" isBusy={this.props.isBusy} />
      </div>
    );
  }
  
  renderNoAccountButtons() {
    return (
      <React.Fragment>
        <p>There is no account associated with this email, would you like to create one or checkout as a guest?</p>
        <div className="text-right mt-3">
          <Button title="Guest Checkout" onClick={this.onPressGuestCheckout} variant="link" />
          <Button title="Create Account" onClick={this.onPressShowCreateAccountForm} />
        </div>
      </React.Fragment>
    );
  }
  
  renderLoginForm() {
    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressLogin}>
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

          <div className="text-right mt-3">
            <Button title="Login" type="submit" isBusy={this.props.isBusy} />
          </div>
        </Form>
      </FormContext.Provider>
    );
  }

  renderCreateAccountForm() {
    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressCreateAccount}>

          <p>Please enter your details.</p>

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

          <div className="text-right mt-3">
            <Button title="Cancel" onClick={this.onPressCancelCreateAccount} variant="link" />
            <Button title="Continue" type="submit" isBusy={this.props.isBusy} />
          </div>

        </Form>
      </FormContext.Provider>
    );
  }

  renderIsLoggedInForm() {
    return (
      <React.Fragment>
        <p>You're currently logged-in as {this.props.loggedInEmail}</p>
        <div className="text-right mt-3">
          <Button title="Logout" onClick={this.onPressLogout} variant="link" />
          <Button title="Continue" onClick={this.onPressStayLoggedIn} />
        </div>
      </React.Fragment>
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

const mapStateToProps = (state, ownProps) => {
  const { customer, jwt } = state.cart;
  const { emailStatus, isCreatingAccount } = getPanelData(state, ownProps.index);

  return {
    isBusy: state.status === statuses.busy,
    emailStatus: emailStatus,
    isCreatingAccount: isCreatingAccount,
    isLoggedIn: !!(jwt && customer),
    loggedInEmail: customer && customer.email,
    errors: state.errors,
  };
};

const actions = {
  hasAccount: hasAccount,
  login: login,
  logout: logout,

  updateFormData: updateFormData,
  resetFormData: resetFormData,

  nextPanel: nextPanel,
  editPanel: editPanel,
  updatePanelData: updatePanelData,
  resetPanels: resetPanels,

  resetEmailStatus: resetEmailStatus,
};

export const LoginPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_LoginPanel);
