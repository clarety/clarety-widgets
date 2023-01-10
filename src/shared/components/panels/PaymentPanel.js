import React from 'react';
import { Form, Row, Col, Spinner, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { CardNumberElement, CardExpiryElement, CardCvcElement, AuBankAccountElement } from '@stripe/react-stripe-js';
import { Config } from 'clarety-utils';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, injectStripe } from 'shared/components';
import { requiredField, cardNumberField, cardExpiryField, ccvField, isStripeCard, isStripeAuBankAccount } from 'shared/utils';
import { TextInput, SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput, AccountNumberInput, BsbInput, NZAccountNumberInput, PhoneInput, NumberInput, SelectInput } from 'form/components';

export class _PaymentPanel extends BasePanel {
  state = {
    showCvcInfo: false,
  };

  constructor(props) {
    super(props);
    this.selectFirstPaymentMethod();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    const { paymentMethods } = this.props;

    if (this.didPaymentMethodsChange(prevProps.paymentMethods, paymentMethods)) {
      this.selectFirstPaymentMethod();
    }
  }

  selectFirstPaymentMethod() {
    const { paymentMethods, updateFormData } = this.props;

    const paymentMethod = paymentMethods && paymentMethods[0] && paymentMethods[0].type
      ? paymentMethods[0].type
      : 'na';

    updateFormData('payment.type', paymentMethod);
  }

  didPaymentMethodsChange(prev, current) {
    if (!prev && !current) return false;
    if (!prev && current) return true;
    if (prev && !current) return true;

    if (prev.length !== current.length) return true;

    for (let index = 0; index < prev.length; index++) {
      if (prev[index].type !== current[index].type) return true;
    }

    return false;
  }

  onShowPanel() {
    this.props.onShowPanel();

    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  onSelectPaymentType = (paymentType) => {
    this.props.updateFormData('payment.type', paymentType);
  };

  isHKDirectDebitAuth() {
    if (this.props.cartStatus === 'authorise') {
      const paymentMethod = this.getSelectedPaymentMethod();
      if (paymentMethod) {
        return paymentMethod.type === 'gatewaydd'
            && paymentMethod.gateway === 'hk';
      }
    }

    return false;
  }

  onPressBack = (event) => {
    event.preventDefault();

    if (this.isHKDirectDebitAuth()) {
      const paymentMethod = this.getSelectedPaymentMethod();
      this.props.cancelPaymentAuthorise(paymentMethod);
    } else {
      this.props.prevPanel();
    }
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout } = this.props;

    if (layout === 'page') return;

    const isValid = this.validate();
    if (!isValid) return;
    
    const paymentData = this.getPaymentData();
    const didSubmit = await onSubmit(paymentData);
    if (!didSubmit) return;

    nextPanel();
  };

  isPaymentTypeDirectDebit(type) {
    return type === 'gatewaydd' || type === 'dd';
  }

  validate() {
    const errors = [];

    const paymentMethod = this.getSelectedPaymentMethod();
    this.validateFields(paymentMethod, errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(paymentMethod, errors) {
    if (paymentMethod.type === 'gatewaycc') {
      if (isStripeCard(paymentMethod)) {
        return this.validateStripeFields(errors);
      } else {
        return this.validateCreditCardFields(errors);
      }
    }

    if (this.isPaymentTypeDirectDebit(paymentMethod.type)) {
      if(isStripeAuBankAccount(paymentMethod)) {
        return this.validateStripeAuBankAccountFields(errors);
      } else {
        switch (paymentMethod.gateway) {
          case 'nz': return this.validateNZDirectDebitFields(errors);
          case 'hk': return this.validateHKDirectDebitFields(errors);
          default:   return this.validateDirectDebitFields(errors);
        }
      }
    }
    
    if (paymentMethod.type === 'na') {
      return this.validateNoPaymentFields(errors);
    }

    throw new Error(`[Clarety] unhandled 'validate' for paymentMethod.type: ${paymentMethod.type}`);
  }

  validateStripeAuBankAccountFields(errors) {
    const { formData } = this.props;
    requiredField(errors, formData, 'payment.accountName');
  }

  validateStripeFields(errors) {
    const { formData } = this.props;
    requiredField(errors, formData, 'payment.cardName');
  }

  validateCreditCardFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'payment.cardName');
    cardNumberField(errors, formData, 'payment.cardNumber');
    cardExpiryField(errors, formData, 'payment.cardExpiry', 'payment.cardExpiryMonth', 'payment.cardExpiryYear');
    ccvField(errors, formData, 'payment.cardSecurityCode');
  }

  validateDirectDebitFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'payment.accountName');
    requiredField(errors, formData, 'payment.accountNumber');
    requiredField(errors, formData, 'payment.accountBSB');
  }

  validateNZDirectDebitFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'payment.accountName');
    requiredField(errors, formData, 'payment.bankCode');
    requiredField(errors, formData, 'payment.branchCode');
    requiredField(errors, formData, 'payment.accountNumber');
    requiredField(errors, formData, 'payment.suffixCode');
  }

  validateHKDirectDebitFields(errors) {
    const { formData, cartStatus } = this.props;

    requiredField(errors, formData, 'payment.accountName');
    requiredField(errors, formData, 'payment.bankCode');
    requiredField(errors, formData, 'payment.accountNumber');

    requiredField(errors, formData, 'payment.verificationType');
    requiredField(errors, formData, 'payment.verificationNumber');

    if (cartStatus === 'authorise') {
      requiredField(errors, formData, 'payment.authPassword');
    }
  }

  validateNoPaymentFields(errors) {
    // NOTE: no validation required.
  }

  getPaymentData() {
    const { formData, cartStatus } = this.props;

    const paymentType = formData['payment.type'];
    const paymentMethod = this.getPaymentMethod(paymentType);

    if (paymentType === 'gatewaycc') {
      if (isStripeCard(paymentMethod)) {
        return {
          type:     paymentType,
          stripe:   this.props.stripe,
          elements: this.props.elements,
          cardName: formData['payment.cardName'],
        };
      } else {
        return {
          type:             paymentType,
          cardName:         formData['payment.cardName'],
          cardNumber:       formData['payment.cardNumber'],
          cardExpiryMonth:  formData['payment.cardExpiryMonth'],
          cardExpiryYear:   '20' + formData['payment.cardExpiryYear'],
          cardSecurityCode: formData['payment.cardSecurityCode'],
        };
      }
    }

    if (this.isPaymentTypeDirectDebit(paymentType)) {
      if (paymentMethod.gateway === 'stripe-becs') {
        return {
          type:     paymentType,
          stripe:   this.props.stripe,
          elements: this.props.elements,
          accountName: formData['payment.accountName'],
          customerEmail: formData['customer.email'],
        };
      } else if (paymentMethod.gateway === 'nz') {
        return {
          type:          paymentType,
          accountName:   formData['payment.accountName'],
          bankCode:      formData['payment.bankCode'],
          branchCode:    formData['payment.branchCode'],
          accountNumber: formData['payment.accountNumber'],
          suffixCode:    formData['payment.suffixCode'],
        };
      } else if (paymentMethod.gateway === 'hk') {
        const paymentData = {
          type:               paymentType,
          accountName:        formData['payment.accountName'],
          bankCode:           formData['payment.bankCode'],
          accountNumber:      formData['payment.accountNumber'],
          verificationType:   formData['payment.verificationType'],
          verificationNumber: formData['payment.verificationNumber'],
          verificationMobile: formData['payment.verificationMobile'],
        };

        if (cartStatus === 'authorise') {
          paymentData['authSecret']   = this.props.authSecret;
          paymentData['authPassword'] = formData['payment.authPassword'];
        }

        return paymentData;
      } else {
        return {
          type:          paymentType,
          accountName:   formData['payment.accountName'],
          accountBSB:    formData['payment.accountBSB'],
          accountNumber: formData['payment.accountNumber'],
        };
      }
    }

    if (paymentType === 'na') {
      return { type: paymentType };
    }

    throw new Error(`[Clarety] unhandled 'getPaymentData' for paymentType: ${paymentType}`);
  }

  getSelectedPaymentMethod() {
    const paymentType = this.props.formData['payment.type'];
    return this.getPaymentMethod(paymentType);
  }

  getPaymentMethod(type) {
    return this.props.paymentMethods.find(method => method.type === type);
  }

  getTitleText() {
    const { settings } = this.props;
    return settings.title || t('payment-details', 'Payment Details');
  }

  getSubmitBtnText() {
    const { settings } = this.props;
    return settings.submitBtnText || t('pay', 'Pay Now');
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="payment-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={this.getTitleText()}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, paymentMethods } = this.props;

    return (
      <form onSubmit={this.onPressNext} data-testid="payment-panel">
        <PanelContainer layout={layout} status="edit" className="payment-panel">
          {this.renderHeader()}

          {paymentMethods
            ? this.renderContent()
            : this.renderLoading()
          }
        </PanelContainer>
      </form>
    );
  }

  renderHeader() {
    const { layout, index, settings } = this.props;
    if (settings.hideHeader) return null;

    return (
      <PanelHeader
        status="edit"
        layout={layout}
        number={index + 1}
        title={this.getTitleText()}
      />
    );
  }

  renderContent() {
    const { layout, isBusy } = this.props;
    const paymentMethod = this.getSelectedPaymentMethod();
    if (!paymentMethod) return null;

    if (this.isHKDirectDebitAuth()) {
      return this.renderHKAuthorise();
    }

    return (
      <React.Fragment>
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderCartSummary()}
          {this.renderErrorMessages()}
          {this.renderPaymentMethodOptions()}
          {this.renderPaymentFields(paymentMethod)}
          {this.renderTermsCheckbox()}
        </PanelBody>

        {this.renderFooter()}
      </React.Fragment>
    );
  }

  renderErrorMessages() {
    if (this.props.layout === 'page') return null;
    return <ErrorMessages />;
  }

  renderCartSummary() {
    return null;
  }

  renderTermsCheckbox() {
    return null;
  }

  renderLoading() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  getDirectDebitType() {
    if(!!this.getPaymentMethod('gatewaydd')) return 'gatewaydd';
    if(!!this.getPaymentMethod('dd')) return 'dd';
    return null;
  }

  renderPaymentMethodOptions() {
    const directDebitType = this.getDirectDebitType();
    const showCC = !!this.getPaymentMethod('gatewaycc');
    const showDD = !!directDebitType;

    // Don't display selector if there's only one option.
    if (!showCC || !showDD) return null;

    return (
      <div className="payment-method-select">
        <ToggleButtonGroup
          type="radio"
          name="payment-method"
          value={this.props.formData['payment.type']}
          onChange={this.onSelectPaymentType}
        >
          {showCC && <ToggleButton value="gatewaycc" variant="outline-secondary">{t('credit-card', 'Credit Card')}</ToggleButton>}
          {showDD && <ToggleButton value={directDebitType} variant="outline-secondary">{t('direct-debit', 'Direct Debit')}</ToggleButton>}
        </ToggleButtonGroup>
      </div>
    );
  }

  renderPaymentFields(paymentMethod) {
    if (paymentMethod.type === 'gatewaycc') {
      if (isStripeCard(paymentMethod)) {
        return this.renderStripeFields(paymentMethod);
      } else {
        return this.renderCreditCardFields(paymentMethod);
      }
    }

    if (this.isPaymentTypeDirectDebit(paymentMethod.type)) {
      if (isStripeAuBankAccount(paymentMethod)) {
        return this.renderStripeBecsFields(paymentMethod);
      } else {
        switch (paymentMethod.gateway) {
          case 'nz': return this.renderNZDirectDebitFields(paymentMethod);
          case 'hk': return this.renderHKDirectDebitFields(paymentMethod);
          default:   return this.renderDirectDebitFields(paymentMethod);
        }
      }
    }

    if (paymentMethod.type === 'na') {
      return this.renderNoPaymentFields(paymentMethod);
    }

    throw new Error(`[Clarety] unhandled 'renderPaymentFields' for paymentMethod.type: ${paymentMethod.type}`);
  }

  renderCreditCardFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="cardName">
              <Form.Label>{t('card-name', 'Name on Card')}</Form.Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              <Form.Label>{t('card-number', 'Card Number')}</Form.Label>
              <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>{t('card-expiry', 'Expiry')}</Form.Label>
              <ExpiryInput
                field="payment.cardExpiry"
                monthField="payment.cardExpiryMonth"
                yearField="payment.cardExpiryYear"
                testId="expiry-input"
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="ccv">
              <Form.Label>{t('card-ccv', 'CVC')}</Form.Label>
              {this.renderCvcInfoBtn()}
              <CcvInput field="payment.cardSecurityCode" testId="ccv-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        {this.renderCvcInfo()}
      </React.Fragment>
    );
  }

  renderDirectDebitFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Form.Label>{t('account-name', 'Account Name')}</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="accountBSB">
              <Form.Label>{t('account-bsb', 'Account BSB')}</Form.Label>
              <BsbInput field="payment.accountBSB" testId="account-bsb-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Form.Label>{t('account-number', 'Account Number')}</Form.Label>
              <AccountNumberInput field="payment.accountNumber" testId="account-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderNZDirectDebitFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Form.Label>{t('account-name', 'Account Name')}</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>{t('account-number', 'Account Number')}</Form.Label>

              <NZAccountNumberInput
                bankCodeField="payment.bankCode"
                branchCodeField="payment.branchCode"
                accountNumberField="payment.accountNumber"
                suffixCodeField="payment.suffixCode"
              />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderHKDirectDebitFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Form.Label>{t('account-name', 'Account Name')}</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="bankCode">
              <Form.Label>{t('bank-code', 'Bank Code')}</Form.Label>
              <NumberInput field="payment.bankCode" maxLength={3} testId="bank-code-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Form.Label>{t('account-number', 'Account Number')}</Form.Label>
              <AccountNumberInput field="payment.accountNumber" maxLength={12} testId="account-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="verificationType">
              <Form.Label>{t('verification-type', 'Verification Type')}</Form.Label>
              <SelectInput
                field="payment.verificationType"
                options={[
                  { value: '1', label: t('hkid', 'HKID') },
                  { value: '2', label: t('passport', 'Passport') }
                ]}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="verificationNumber">
              <Form.Label>{t('verification-number', 'Verification Number')}</Form.Label>
              <TextInput field="payment.verificationNumber" testId="verification-number-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="verificationMobile">
              <Form.Label>{t('verification-mobile', 'Verification Mobile')}</Form.Label>
              <PhoneInput field="payment.verificationMobile" testId="verification-mobile-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderStripeBecsFields(paymentMethod) {
    const { settings } = this.props;
    const style = settings.stripeStyle || { base: { fontSize: '16px' } };

    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Form.Label>{t('account-name', 'Account Name')}</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="account">
              <Form.Label>{t('account', 'Account')}</Form.Label>
              <AuBankAccountElement options={{ style, hideIcon: true }} />
            </Form.Group>
          </Col>
        </Form.Row>

        <div className="stripe-becs-terms">
          By providing your bank account details and confirming this payment, you agree to this Direct Debit Request and the <a href="https://stripe.com/au-becs-dd-service-agreement/legal" target="_blank">Direct Debit Request service agreement</a>, and authorise Stripe Payments Australia Pty Ltd ACN 160 180 343 Direct Debit User ID number 507156 (“Stripe”) to debit your account through the Bulk Electronic Clearing System (BECS) on behalf of (the “Merchant”) for any amounts separately communicated to you by the Merchant. You certify that you are either an account holder or an authorised signatory on the account listed above.
        </div>
      </React.Fragment>
    );
  }

  renderStripeFields(paymentMethod) {
    const { settings } = this.props;
    const style = settings.stripeStyle || { base: { fontSize: '16px' } };

    return (
      <React.Fragment>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardName">
              <Form.Label>{t('card-name', 'Name on Card')}</Form.Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              <Form.Label>{t('card-number', 'Card Number')}</Form.Label>
              <CardNumberElement
                options={{ style, placeholder: '•••• •••• •••• ••••' }}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>{t('card-expiry', 'Expiry')}</Form.Label>
              <CardExpiryElement
                options={{
                  style,
                  placeholder: t('card-expiry-placeholder', 'MM / YY'),
                }}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="ccv">
              <Form.Label>{t('card-ccv', 'CVC')}</Form.Label>
              {this.renderCvcInfoBtn()}
              <CardCvcElement
                options={{ style, placeholder: '•••' }}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        {this.renderCvcInfo()}

      </React.Fragment>
    );
  }

  renderCvcInfoBtn() {
    const { settings } = this.props;
    if (!settings.showCvcInfoBtn) return null;

    return (
      <a href="#" onClick={this.onClickCvcInfo} className="float-right small">
        {t('what-is-this', 'What is this?')}
      </a>
    );
  }

  onClickCvcInfo = (event) => {
    event.preventDefault();

    this.setState(prevState => ({
      showCvcInfo: !prevState.showCvcInfo,
    }));
  }

  renderCvcInfo() {
    if (!this.state.showCvcInfo) return null;

    const imagePath = Config.get('imagePath') || 'images';

    return (
      <React.Fragment>
        <p className="cvc-info small">
          {t('cvc-info', "CVV is a security feature to help verify that you are in possession of your credit card. For Visa, Mastercard, or Discover, the three-digit CVV number is printed on the signature panel on the back of the card immediately after the card's account number. For American Express, the four-digit CVV number is printed on the front of the card above the card account number.")}
        </p>

        <Form.Row className="mb-4">
          <Col className="text-right">
            <img src={`${imagePath}/cvv-amex.png`} className="img-fluid" />
          </Col>
          <Col>
            <img src={`${imagePath}/cvv-visa.png`} className="img-fluid" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderNoPaymentFields() {
    return (
      <p>{t('free-order', 'Your order is free, no payment is required.')}</p>
    );
  }

  renderFooter() {
    const { layout, isBusy, settings } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          {layout === 'tabs' && 
            <Col xs={6}>
              <BackButton
                title={settings.backBtnText || t('back', 'Back')}
                onClick={this.onPressBack}
              />
            </Col>
          }

          <Col xs={layout === 'tabs' ? 6 : 12}>
            <SubmitButton
              title={this.getSubmitBtnText()}
              testId="next-button"
            />
          </Col>
        </Form.Row>

        {this.renderTerms()}
      </PanelFooter>
    );
  }

  renderHKAuthorise() {
    const { layout, isBusy } = this.props;

    return (
      <React.Fragment>
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderCartSummary()}
          {this.renderErrorMessages()}
          
          <Form.Row>
            <Col>
              <Form.Group controlId="authPassword">
                <Form.Label>
                  {t('payment-auth-code', 'Please enter the authorisation code sent to your device')}
                </Form.Label>
                <NumberInput
                  field="payment.authPassword"
                  maxLength={6}
                  testId="auth-password-input"
                />
              </Form.Group>
            </Col>
          </Form.Row>
        </PanelBody>

        {this.renderFooter()}
      </React.Fragment>
    );
  }

  renderTerms() {
    const { settings } = this.props;

    if (settings.TermsComponent) {
      return <settings.TermsComponent {...this.props} />;
    }

    return null;
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="payment-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={this.getTitleText()}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}

export const PaymentPanel = injectStripe(_PaymentPanel);
