import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Col, Form } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses, login, logout } from 'shared/actions';
import { parseNestedElements } from 'shared/utils';
import { setFormData, resetFormData } from 'form/actions';
import { BasePanel, TextInput, EmailInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { hasAccount, fetchAuthCustomer } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _LoginPanel extends BasePanel {
  constructor(props) {
    super(props);

    this.state.mode = 'check-email';
  }

  setMode(mode) {
    this.setState({ mode });
  }

  onPressCheckEmail = async event => {
    event.preventDefault();

    const { hasAccount, settings, resetFormData } = this.props;
    const { email } = this.state.formData;

    if (this.validate()) {
      const emailStatus = await hasAccount(email);
      
      if (emailStatus === 'not-checked') this.setMode('check-email');

      if (emailStatus === 'no-account') {
        if (settings.allowGuest) {
          this.setMode('no-account');
        } else {
          this.setMode('create-account');
        }
      }

      if (emailStatus === 'has-account') this.setMode('login');

      resetFormData();
    }
  };

  onPressLogin = async event => {
    event.preventDefault();

    const { login, fetchAuthCustomer, nextPanel } = this.props;
    const { email, password } = this.state.formData;

    const didValidate = this.validate();
    if (!didValidate) return;
    
    const didLogin = await login(email, password);
    if (!didLogin) return;

    const didFetch = await fetchAuthCustomer();
    if (!didFetch) return;

    this.setMode('logged-in');

    nextPanel();
  };

  onPressShowCreateAccountForm = () => {
    this.setMode('create-account');
  };

  onPressCancelCreateAccount = () => {
    this.setMode('no-account');
  }

  onPressCreateAccount = async (event) => {
    event.preventDefault();

    const { setFormData, nextPanel, settings } = this.props;

    if (this.validate()) {
      const createAccountFormData = this.getCreateAccountFormData();
      setFormData(createAccountFormData);

      if (settings.createAccount) {
        const { customer } = parseNestedElements(createAccountFormData);
        // TODO: setup 'create account' action in registrations? what if this runs in the checkout?
        // await createAccount(customer);
      }

      nextPanel();
    }
  };

  onPressGuestCheckout = () => {
    const { setFormData, nextPanel } = this.props;
    const { email } = this.state.formData;

    setFormData({ 'customer.email': email });
    nextPanel();
  };

  onPressLogout = () => {
    const { resetAllPanels, resetFormData, logout } = this.props;

    this.onChangeField('email', '');
    this.onChangeField('password', '');

    this.setMode('check-email');

    resetAllPanels();
    resetFormData();
    logout();
  }

  onPressStayLoggedIn = () => {
    this.props.nextPanel();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    // Check if email has been modified, and reset status.
    if (this.state.formData.email !== prevState.formData.email) {
      this.setMode('check-email');
      this.onChangeField('password', '');
    }

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  validate() {
    const errors = [];

    const { mode } = this.state;
    const { settings } = this.props;

    if (mode === 'check-email') {
      this.validateEmail('email', errors);
    }

    if (mode === 'create-account') {
      this.validateEmail('email', errors);
      this.validatePassword('password', errors);
      if (settings.showFirstName) this.validateRequired('firstName', errors);
      if (settings.showLastName) this.validateRequired('lastName', errors);
    }

    if (mode === 'login') {
      this.validateEmail('email', errors);
      this.validateRequired('password', errors);
    }

    this.setState({ errors });
    return errors.length === 0;
  }

  getCreateAccountFormData() {
    const { settings } = this.props;

    const formData = {
      'customer.email':    this.state.formData.email,
      'customer.password': this.state.formData.password,
    };

    if (settings.showFirstName) formData['customer.firstName'] = this.state.formData.firstName;
    if (settings.showLastName)  formData['customer.lastName']  = this.state.formData.lastName;

    return formData;
  }

  reset() {
    // Clear all form data except email.
    this.setState(prevState => ({
      formData: {
        email: prevState.formData.email,
      },
    }));
  }

  renderWait() {
    if (this.props.layout === 'stack') return null;

    const { index } = this.props;

    return (
      <WaitPanelHeader number={index + 1} title="Contact Details" />
    );
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          layout={layout}
          number={index + 1}
          title="Contact Details"
          intlId="loginPanel.editTitle"
        />

        <PanelBody layout={layout} isBusy={isBusy}>
          {this.renderForm()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderForm() {
    const { mode } = this.state;

    if (mode === 'check-email')    return this.renderEmailCheckForm(false);
    if (mode === 'no-account')     return this.renderEmailCheckForm(true);
    if (mode === 'create-account') return this.renderCreateAccountForm();
    if (mode === 'login')          return this.renderLoginForm();
    if (mode === 'logged-in')      return this.renderIsLoggedInForm();
  }

  renderEmailCheckForm(hasNoAccount) {
    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressCheckEmail}>
          <Form.Row>
            <Col>
              <EmailInput field="email" placeholder="Email *" />
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
              <EmailInput field="email" placeholder="Email *" />
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
    const { settings } = this.props;

    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressCreateAccount}>

          <p>Please enter your details.</p>

          <Form.Row>
            <Col>
              <EmailInput field="email" placeholder="Email *" />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput field="password" type="password" placeholder="Password *" />
            </Col>
          </Form.Row>

          {settings.showFirstName &&
            <Form.Row>
              <Col>
                <TextInput field="firstName" placeholder="First Name *" />
              </Col>
            </Form.Row>
          }

          {settings.showLastName &&
            <Form.Row>
              <Col>
                <TextInput field="lastName" placeholder="Last Name *" />
              </Col>
            </Form.Row>
          }

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
        <p>You're currently logged-in as {this.props.customer.email}</p>
        <div className="text-right mt-3">
          <Button title="Logout" onClick={this.onPressLogout} variant="link" />
          <Button title="Continue" onClick={this.onPressStayLoggedIn} />
        </div>
      </React.Fragment>
    );
  }

  renderDone() {
    const { index } = this.props;
    const email = this.state.formData['email'];

    return (
      <DonePanelHeader
        number={index + 1}
        title={email}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
    customer: state.cart.customer,
    errors: state.errors,
  };
};

const actions = {
  hasAccount: hasAccount,
  login: login,
  logout: logout,
  fetchAuthCustomer: fetchAuthCustomer,

  setFormData: setFormData,
  resetFormData: resetFormData,
};

export const LoginPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_LoginPanel);





// TODO: move...

const PanelContainer = ({ layout, children }) => {
  if (layout === 'stack') {
    return <Container>{children}</Container>;
  }

  if (layout === 'accordian') {
    return <div className="panel">{children}</div>;
  }

  return children;
};

const PanelHeader = ({ layout, title, number, intlId }) => {
  if (layout === 'stack') {
    return <StackPanelHeader intlId={intlId} />;
  }

  if (layout === 'accordian') {
    return <AccordianPanelHeader number={number} title={title} />;
  }
};

const PanelBody = ({ layout, isBusy, children }) => {
  if (layout === 'stack') {
    return <div className="panel-body">{children}</div>;
  }

  if (layout === 'accordian') {
    return <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>{children}</BlockUi>;
  }

  return children;
};

const StackPanelHeader = ({ intlId }) => (
  <FormattedMessage id={intlId} tagName="h2" />
);

const AccordianPanelHeader = ({ number, title }) => (
  <EditPanelHeader number={number} title={title} />
);
