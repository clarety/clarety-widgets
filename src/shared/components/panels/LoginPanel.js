import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext } from 'shared/utils';
import { BasePanel, TextInput, EmailInput, DobInput, Button, FormElement } from 'checkout/components';

export class LoginPanel extends BasePanel {
  constructor(props) {
    super(props);
    this.state.mode = props.isLoggedIn
      ? 'logged-in'
      : props.settings.guestOnly
      ? 'guest-account'
      : 'check-email';

    this.state.passwordResetStatus = 'ready';
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

  onPressCheckEmail = async (event) => {
    event.preventDefault();

    const { hasAccount } = this.props;
    const { email } = this.state.formData;

    if (this.validate()) {
      const emailStatus = await hasAccount(email);
      
      if (emailStatus === 'not-checked') this.setMode('check-email');

      if (emailStatus === 'no-account') this.setMode('no-account');

      if (emailStatus === 'has-account') {
        this.setMode('login');
        this.setState({ passwordResetStatus: 'ready' });
      }
    }
  };

  onPressLogin = async (event) => {
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

  onPressResetPassword = async () => {
    const didReset = await this.props.resetPassword(this.state.formData.email);
    if (didReset) {
      this.setState({ passwordResetStatus: 'success' });
    } else {
      this.setState({ passwordResetStatus: 'fail' });
    }
  };

  onPressShowCreateAccountForm = () => {
    this.setMode('create-account');
  };

  onPressCancelCreateAccount = () => {
    this.setMode('no-account');
  };

  onPressCreateAccount = async (event) => {
    event.preventDefault();

    const { setFormData, nextPanel, settings, createAccount, createGuestAccount } = this.props;

    if (this.validate()) {
      const formData = this.getCreateAccountFormData();
      setFormData(formData);

      if (settings.createAccount) {
        if (this.state.mode === 'guest-account') {
          await createGuestAccount();
        } else {
          await createAccount();
        }
      }      

      nextPanel();
    }
  };

  onPressGuestCheckout = () => {
    const { setFormData, nextPanel, settings } = this.props;

    if (settings.showGuestForm) {
      this.setMode('guest-account');
    } else {
      setFormData({ 'customer.email': this.state.formData.email });
      nextPanel();
    }    
  };

  onPressStayLoggedIn = () => {
    const { setFormData, nextPanel, customer } = this.props;

    setFormData({ 'customer.email': customer.email });
    nextPanel();
  };

  onPressLogout = async () => {
    this.onChangeField('email', '');
    this.onChangeField('password', '');
    await this.props.logout();
    this.setMode('check-email');
  };

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    // Check if email has been modified, and reset status.
    if (!this.props.settings.guestOnly) {
      if (this.state.formData.email !== prevState.formData.email) {
        this.setMode('check-email');
        this.onChangeField('password', '');
      }
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
      this.validatePassword('password', errors);
    }

    if (mode === 'create-account' || mode === 'guest-account') {
      this.validateEmail('email', errors);

      if (settings.showFirstName) this.validateRequired('firstName', errors);
      if (settings.showLastName)  this.validateRequired('lastName', errors);

      if (settings.showDob) {
        this.validateRequired('dateOfBirthDay', errors);
        this.validateRequired('dateOfBirthMonth', errors);
        this.validateRequired('dateOfBirthYear', errors);

        if (settings.minAge) {
          this.validateDob({
            field: 'dateOfBirth',
            dayField: 'dateOfBirthDay',
            monthField: 'dateOfBirthMonth',
            yearField: 'dateOfBirthYear',
            minAge: settings.minAge,
            errors: errors,
          });
        }
      }
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
      'customer.email': this.state.formData.email,
      'customer.language': this.state.formData.language,
    };

    if (this.state.mode === 'create-account') {
      formData['customer.password'] = this.state.formData.password;
    }

    if (settings.showFirstName) formData['customer.firstName'] = this.state.formData.firstName;
    if (settings.showLastName)  formData['customer.lastName']  = this.state.formData.lastName;

    if (settings.showDob) {
      formData['customer.dateOfBirthDay']   = this.state.formData.dateOfBirthDay;
      formData['customer.dateOfBirthMonth'] = this.state.formData.dateOfBirthMonth;
      formData['customer.dateOfBirthYear']  = this.state.formData.dateOfBirthYear;
    }

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

  allowGuest() {
    const { settings, cartAllowsGuest } = this.props;

    // Ignore panel setting if cart doesn't allow guest.
    if (cartAllowsGuest === false) return false;

    return settings.allowGuest;
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={t('loginPanel.waitTitle', settings.title || 'Account Details')}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, isBusyResetPassword, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} className="login-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('loginPanel.editTitle', settings.title || 'Account Details')}
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy || isBusyResetPassword}>
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
    if (mode === 'guest-account')  return this.renderCreateAccountForm();
    if (mode === 'login')          return this.renderLoginForm();
    if (mode === 'logged-in')      return this.renderIsLoggedInForm();
  }

  renderEmailCheckForm(hasNoAccount) {
    const { settings } = this.props;

    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressCheckEmail}>
          <p>{t('loginPanel.checkEmailPrompt', 'Please type in an email address so we can check if you already have an account')}</p>

          <Form.Row>
            <Col>
              <EmailInput
                field="email"
                label={t('label.customer.email', 'Email')}
                hideLabel={settings.hideLabels}
                required
              />
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
        <Button
          title={t('btn.next', 'Next')}
          type="submit"
          isBusy={this.props.isBusy}
          className="btn-check-email"
        />
      </div>
    );
  }
  
  renderNoAccountButtons() {
    const { settings } = this.props;

    return (
      <React.Fragment>
        {this.allowGuest()
          ? <p>{t(['loginPanel.noAccountPromptGuest', 'loginPanel.noAccountPrompt'], 'There is no account associated with this email, would you like to create one or checkout as a guest?')}</p>
          : <p>{t('loginPanel.noAccountPrompt', 'There is no account associated with this email, please create one.')}</p>
        }

        <div className="panel-actions">
          {this.allowGuest() &&
            <Button
              title={t('btn.guestCheckout', 'Guest Checkout')}
              onClick={this.onPressGuestCheckout}
              variant="secondary"
              className="btn-guest-checkout"
            />
          }

          <Button
            title={t('btn.createAccount', 'Create Account')}
            onClick={this.onPressShowCreateAccountForm}
            className="btn-create-account"
          />
        </div>
      </React.Fragment>
    );
  }
  
  renderLoginForm() {
    const { isBusy, isBusyResetPassword, settings } = this.props;
    const { passwordResetStatus } = this.state;

    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressLogin}>
          <p>{t('loginPanel.loginPrompt', 'You already have an account, please login to continue')}</p>

          <Form.Row>
            <Col>
              <EmailInput
                field="email"
                label={t('label.customer.email', 'Email')}
                hideLabel={settings.hideLabels}
                required
              />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput
                field="password"
                label={t('label.customer.password', 'Password')}
                type="password"
                hideLabel={settings.hideLabels}
                required
              />
            </Col>
          </Form.Row>

          <Row>
            <Col>
              {passwordResetStatus === 'success' &&
                <p>{t('loginPanel.passwordResetSuccess', 'A temporary password email has been sent to you, please check your email')}</p>
              }

              {passwordResetStatus === 'failure' &&
                <p>{t('loginPanel.passwordResetFailure', 'Sorry, we could not reset your password')}</p>
              }
            </Col>
          </Row>

          <div className="panel-actions">
            <Button
              title={t('btn.resetPassword', 'Reset My Password')}
              variant="secondary"
              onClick={this.onPressResetPassword}
              isBusy={isBusyResetPassword}
              className="btn-reset-password"
            />

            <Button
              title={t('btn.login', 'Login')}
              type="submit"
              isBusy={isBusy}
              className="btn-login"
            />
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

          <p>{t('loginPanel.createAccountPrompt', 'Please enter your details')}</p>

          <Form.Row>
            <Col>
              <EmailInput
                field="email"
                label={t('label.customer.email', 'Email')}
                hideLabel={settings.hideLabels}
                required
              />
            </Col>
          </Form.Row>
          
          {this.state.mode === 'create-account' &&
            <Form.Row>
              <Col>
                <TextInput
                  field="password"
                  label={t('label.customer.password', 'Password')}
                  type="password"
                  hideLabel={settings.hideLabels}
                  required
                />
              </Col>
            </Form.Row>
          }

          {settings.showFirstName &&
            <Form.Row>
              <Col>
                <TextInput
                  field="firstName"
                  label={t('label.customer.firstName', 'First Name')}
                  hideLabel={settings.hideLabels}
                  required
                />
              </Col>
            </Form.Row>
          }

          {settings.showLastName &&
            <Form.Row>
              <Col>
                <TextInput
                  field="lastName"
                  label={t('label.customer.lastName', 'Last Name')}
                  required
                  hideLabel={settings.hideLabels}
                />
              </Col>
            </Form.Row>
          }

          {settings.showDob &&
            <Form.Row>
              <Col>
                <DobInput
                  field="dateOfBirth"
                  dayField="dateOfBirthDay"
                  monthField="dateOfBirthMonth"
                  yearField="dateOfBirthYear"
                  label={t('label.customer.dateOfBirth', 'Date Of Birth')}
                  required
                  hideLabel={settings.hideLabels}
                />
              </Col>
            </Form.Row>
          }

          <FormElement
            field="language"
            value={getLanguage()}
          />

          <div className="panel-actions">
            <Button
              title={t('btn.cancel', 'Cancel')}
              onClick={this.onPressCancelCreateAccount}
              variant="secondary"
              className="btn-create-account-cancel"
            />

            <Button
              title={t('btn.next', 'Next')}
              type="submit"
              isBusy={this.props.isBusy}
              className="btn-create-account-submit"
            />
          </div>

        </Form>
      </FormContext.Provider>
    );
  }

  renderIsLoggedInForm() {
    const { customer } = this.props;

    return (
      <React.Fragment>
        <p>{t('loginPanel.loggedInPrompt', 'You are currently logged-in as')} {customer.email}</p>
        <div className="panel-actions">
          {this.renderLogoutBtn()}

          <Button
            title={t('btn.next', 'Next')}
            onClick={this.onPressStayLoggedIn}
            className="btn-stay-logged-in"
          />
        </div>
      </React.Fragment>
    );
  }

  renderLogoutBtn() {
    if (this.props.settings.useSelfServiceLogout) {
      return (
        <a href="selfservice/login.php?action=logout" className="btn btn-secondary btn-logout">
          {t('btn.logout', 'Logout')}
        </a>
      );
    }

    return (
      <Button
        title={t('btn.logout', 'Logout')}
        onClick={this.onPressLogout}
        variant="secondary"
        className="btn-logout"
      />
    );
  }

  renderDone() {
    const { formData } = this.state;
    const { layout, index, isLoggedIn, customer, settings } = this.props;

    const email = isLoggedIn ? customer.email : formData['email'];

    const title = layout === 'stack'
      ? t('loginPanel.editTitle', settings.title || 'Account Details')
      : email;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
          <p>{email}</p>

          <Button
            onClick={this.onClickEdit}
            title={t('btn.edit', 'Edit')}
            className="btn-edit"
          />
        </PanelBody>
      </PanelContainer>
    );
  }
}
