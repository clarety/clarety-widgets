import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { BasePanel, TextInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, checkForAccount, login, logout, emailStatuses } from 'checkout/actions';
import { updateFormData, resetFormData, updatePanelData, nextPanel, editPanel, resetPanels } from 'checkout/actions';
import { validateCheckEmail, validateLogin, validateCreateAccount } from 'checkout/actions';
import { getPanelData } from 'checkout/selectors';

class _LoginPanel extends BasePanel {
  onPressCheckEmail = event => {
    event.preventDefault();

    const { validateCheckEmail, formData, checkForAccount } = this.props;
    validateCheckEmail({
      onSuccess: () => checkForAccount(formData['customer.email']),
    });
  };

  onPressLogin = event => {
    event.preventDefault();

    const { validateLogin, formData, login } = this.props;
    validateLogin({
      onSuccess: () => login(formData['customer.email'], formData['customer.password']),
    });
  };

  onPressShowCreateAccountForm = () => {
    this.updatePanelData({ isCreatingAccount: true });
  };

  onPressCancelCreateAccount = () => {
    this.updatePanelData({ isCreatingAccount: false });
  }

  onPressCreateAccount = event => {
    event.preventDefault();

    const { validateCreateAccount, nextPanel } = this.props;
    validateCreateAccount({ onSuccess: () => nextPanel() });
  };

  onPressGuestCheckout = () => {
    this.props.nextPanel();
  };

  onPressLogout = () => {
    this.updatePanelData({ isCreatingAccount: false }); // TODO: remove this once we have a 'reset panel data' action.
    // TODO: also reset redux panel data, or make 'resetPanels' reset the data too.
    this.props.resetPanels();
    this.props.resetFormData();
    this.props.logout();
  }

  onPressStayLoggedIn = () => {
    this.props.nextPanel();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if email has been modified, and reset status.
    if (this.props.formData['customer.email'] !== prevProps.formData['customer.email']) {
      this.updatePanelData({ emailStatus: emailStatuses.notChecked });
      this.props.resetPanels();
      this.props.updateFormData({ 'customer.password': '' });
    }
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
      <Form onSubmit={this.onPressCheckEmail}>
        <Form.Row>
          <Col>
            <TextInput field="customer.email" type="email" placeholder="Email *" />
          </Col>
        </Form.Row>

        {hasNoAccount
          ? this.renderNoAccountButtons()
          : this.renderCheckEmailButton()
        }
      </Form>
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
      <Form onSubmit={this.onPressLogin}>
        <p>You already have an account, please login to continue.</p>

        <Form.Row>
          <Col>
            <TextInput field="customer.email" type="email" placeholder="Email *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field="customer.password" type="password" placeholder="Password *" />
          </Col>
        </Form.Row>

        <div className="text-right mt-3">
          <Button title="Login" type="submit" isBusy={this.props.isBusy} />
        </div>
      </Form>
    );
  }

  renderCreateAccountForm() {
    return (
      <Form onSubmit={this.onPressCreateAccount}>

        <p>Please enter your details.</p>

        <Form.Row>
          <Col>
            <TextInput field="customer.email" type="email" placeholder="Email *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field="customer.password" type="password" placeholder="Password *" />
          </Col>
        </Form.Row>

        <div className="text-right mt-3">
          <Button title="Cancel" onClick={this.onPressCancelCreateAccount} variant="link" />
          <Button title="Continue" type="submit" isBusy={this.props.isBusy} />
        </div>

      </Form>
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
    const email = this.props.formData['customer.email'];

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
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  checkForAccount: checkForAccount,
  login: login,
  logout: logout,

  updateFormData: updateFormData,
  resetFormData: resetFormData,

  nextPanel: nextPanel,
  editPanel: editPanel,
  updatePanelData: updatePanelData,
  resetPanels: resetPanels,

  validateCheckEmail: validateCheckEmail,
  validateLogin: validateLogin,
  validateCreateAccount: validateCreateAccount,
};

export const LoginPanel = connect(mapStateToProps, actions)(_LoginPanel);
