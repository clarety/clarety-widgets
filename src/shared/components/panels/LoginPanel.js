import React from 'react';
import { Col, Form, Button as BsButton } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext } from 'shared/utils';
import { BasePanel, TextInput, EmailInput, Button } from 'checkout/components';

export class LoginPanel extends BasePanel {
  constructor(props) {
    super(props);
    this.state.mode = props.isLoggedIn ? 'logged-in' : 'check-email';
  }

  onShowPanel() {
    if (this.props.isLoggedIn) {
      this.setMode('logged-in');
    }
  }

  onClickEdit = () => {
    this.props.editPanel();
  };

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

    const { login, fetchAuthCustomer, nextPanel, setFormData } = this.props;
    const { email, password } = this.state.formData;

    const didValidate = this.validate();
    if (!didValidate) return;

    setFormData({ 'customer.email': email });
    
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

    const { setFormData, nextPanel, settings, createAccount } = this.props;

    if (this.validate()) {
      const createAccountFormData = this.getCreateAccountFormData();
      setFormData(createAccountFormData);

      if (settings.createAccount) await createAccount();

      nextPanel();
    }
  };

  onPressGuestCheckout = () => {
    const { setFormData, nextPanel } = this.props;

    setFormData({ 'customer.email': this.state.formData.email });
    nextPanel();
  };

  onPressStayLoggedIn = () => {
    const { setFormData, nextPanel, customer } = this.props;

    setFormData({ 'customer.email': customer.email });
    nextPanel();
  }

  onPressLogout = async () => {
    this.onChangeField('email', '');
    this.onChangeField('password', '');
    await this.props.logout();
    this.setMode('check-email');
  };

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
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Contact Details"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelContainer layout={layout}  className="login">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Contact Details"
          intlId="loginPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
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
      <div className="panel-actions">
        <Button title="Continue" type="submit" isBusy={this.props.isBusy} />
      </div>
    );
  }
  
  renderNoAccountButtons() {
    return (
      <React.Fragment>
        <p>There is no account associated with this email, would you like to create one or checkout as a guest?</p>
        <div className="panel-actions">
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

          <div className="panel-actions">
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

          <div className="panel-actions">
            {settings.allowGuest &&
              <Button title="Cancel" onClick={this.onPressCancelCreateAccount} variant="link" />
            }
            <Button title="Continue" type="submit" isBusy={this.props.isBusy} />
          </div>

        </Form>
      </FormContext.Provider>
    );
  }

  renderIsLoggedInForm() {
    const { settings } = this.props;

    return (
      <React.Fragment>
        <p>You're currently logged-in as {this.props.customer.email}</p>
        <div className="panel-actions">
          {settings.useSelfServiceLogout
            ? <a href="selfservice/login.php?action=logout" className="btn btn-link">Logout</a>
            : <Button title="Logout" onClick={this.onPressLogout} variant="link" />
          }
          <Button title="Continue" onClick={this.onPressStayLoggedIn} />
        </div>
      </React.Fragment>
    );
  }

  renderDone() {
    const { formData } = this.state;
    const { layout, index, isLoggedIn, customer } = this.props;
    let email = isLoggedIn ? customer.email : formData['email'];

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={email}
          onPressEdit={this.onPressEdit}
          intlId="loginPanel.doneTitle"
        />

        <PanelBody layout={layout} status="done">
          <p>{email}</p>

          <BsButton onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </BsButton>
        </PanelBody>
      </PanelContainer>
    );
  }
}
