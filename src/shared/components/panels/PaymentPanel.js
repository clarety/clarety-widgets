import React from 'react';
import { Form, Row, Col, Spinner, ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { CardNumberElement, CardExpiryElement, CardCvcElement, AuBankAccountElement } from '@stripe/react-stripe-js';
import { t, toTranslationKey } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, injectStripe, Currency } from 'shared/components';
import { Config } from 'shared/utils/config';
import { requiredField, cardNumberField, cardExpiryField, ccvField, isCreditCard, isStripeCard, isStripeBecs, isStripePaymentForm, isXenditCard, isXenditVirtualAccount, isPayPal, isHkDirectDebit, isNzDirectDebit, isCaDirectDebit, isAuDirectDebit, isNoPayment, PaymentGatewayVersion } from 'shared/utils';
import { Label, TextInput, SubmitButton, BackButton, Button, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput, AccountNumberInput, BsbInput, NZAccountNumberInput, PhoneInput, NumberInput, SelectInput, Turnstile } from 'form/components';
import { StripePaymentForm } from 'checkout/components/misc/StripePaymentForm';

export class _PaymentPanel extends BasePanel {
  state = {
    showCvcInfo: false,
    copiedTransferCode: false,
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
      ? this.getPaymentMethodKey(paymentMethods[0])
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
    const { onShowPanel, layout } = this.props;

    if (onShowPanel) {
      onShowPanel();
    }

    if (layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  onSelectPaymentType = (paymentType) => {
    this.props.updateFormData('payment.type', paymentType);
  };

  isAuthorizingHKDirectDebit() {
    const paymentMethod = this.getSelectedPaymentMethod();
    return this.props.cartStatus === 'authorise' && isHkDirectDebit(paymentMethod);
  }

  onPressBack = (event) => {
    event.preventDefault();

    if (this.isAuthorizingHKDirectDebit()) {
      const paymentMethod = this.getSelectedPaymentMethod();
      this.props.cancelPaymentAuthorise(paymentMethod);
    } else {
      this.props.prevPanel();
    }
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout, isPreview } = this.props;

    if (layout === 'page') return;
    if (isPreview) return;

    const isValid = this.validate();
    if (!isValid) return;
    
    const paymentData = this.getPaymentData();
    const didSubmit = await onSubmit(paymentData);
    if (!didSubmit) return;

    nextPanel();
  };

  onPressCopyTransferCode = async (event) => {
    event.preventDefault();

    const { cartPayment } = this.props;
    await navigator.clipboard.writeText(cartPayment.transferCode);
    this.setState({ copiedTransferCode: true });
  };

  validate() {
    const errors = [];

    const paymentMethod = this.getSelectedPaymentMethod();
    this.validateFields(paymentMethod, errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(paymentMethod, errors) {
    if (isStripePaymentForm(paymentMethod)) {
      return errors; // stripe handles validation
    }
    
    if (isStripeCard(paymentMethod)) {
      return this.validateStripeCardFields(errors);
    }

    if (isXenditCard(paymentMethod)) {
      return this.validateXenditCardFields(errors, paymentMethod);
    }
    
    if (isCreditCard(paymentMethod)) {
      return this.validateCreditCardFields(errors);
    }
    
    if (isStripeBecs(paymentMethod)) {
      return this.validateStripeBecsFields(errors);
    }
    
    if (isNzDirectDebit(paymentMethod)) {
      return this.validateNZDirectDebitFields(errors);
    }
    
    if (isHkDirectDebit(paymentMethod)) {
      return this.validateHKDirectDebitFields(errors);
    }
    
    if (isCaDirectDebit(paymentMethod)) {
      return this.validateCADirectDebitFields(errors);
    }
    
    if (isAuDirectDebit(paymentMethod)) {
      return this.validateAUDirectDebitFields(errors);
    }

    if (isXenditVirtualAccount(paymentMethod)) {
      return this.validateXenditVirtualAccountFields(errors);
    }
    
    if (isNoPayment(paymentMethod)) {
      return this.validateNoPaymentFields(errors);
    }

    console.error("[Clarety] unhandled 'validate' for paymentMethod", paymentMethod);
    throw new Error("[Clarety] unhandled 'validate'");
  }

  validateStripeBecsFields(errors) {
    const { formData } = this.props;
    requiredField(errors, formData, 'payment.accountName');
  }

  /** @deprecated use validateStripeCardFields */
  validateStripeFields(errors) {
    return this.validateStripeCardFields(errors);
  }

  validateStripeCardFields(errors) {
    const { formData } = this.props;
    requiredField(errors, formData, 'payment.cardName');
  }

  validateXenditCardFields(errors, paymentMethod) {
    const { formData } = this.props;

    const useFullNameField = !!paymentMethod.additionalSettings.useFullNameField;
    if (useFullNameField) {
      requiredField(errors, formData, 'payment.cardFullName');
    } else {
      requiredField(errors, formData, 'payment.cardFirstName');
      requiredField(errors, formData, 'payment.cardLastName');
    }

    cardNumberField(errors, formData, 'payment.cardNumber');
    cardExpiryField(errors, formData, 'payment.cardExpiry', 'payment.cardExpiryMonth', 'payment.cardExpiryYear');
    ccvField(errors, formData, 'payment.cardSecurityCode');
  }

  validateCreditCardFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'payment.cardName');
    cardNumberField(errors, formData, 'payment.cardNumber');
    cardExpiryField(errors, formData, 'payment.cardExpiry', 'payment.cardExpiryMonth', 'payment.cardExpiryYear');
    ccvField(errors, formData, 'payment.cardSecurityCode');
  }

  validateAUDirectDebitFields(errors) {
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

  validateCADirectDebitFields(errors) {
    const { formData, cartStatus } = this.props;

    requiredField(errors, formData, 'payment.accountName');
    requiredField(errors, formData, 'payment.bankCode');
    requiredField(errors, formData, 'payment.branchCode');
    requiredField(errors, formData, 'payment.accountNumber');
  }

  validateXenditVirtualAccountFields(errors) {
    const { formData } = this.props;
    requiredField(errors, formData, 'payment.accountName');
  }

  validateNoPaymentFields(errors) {
    // NOTE: no validation required.
  }

  showXenditCardEmailField() {
    return false;
  }

  getPaymentData() {
    const { formData, cartStatus, modalPaymentMethod } = this.props;

    const paymentType = modalPaymentMethod?.type || formData['payment.type'];
    const paymentMethod = this.getPaymentMethod(paymentType);

    if (isStripePaymentForm(paymentMethod)) {
      return {
        type: paymentType,
        stripe: this.props.stripe,
        elements: this.props.elements,
        customerInfo: this.getStripeCustomerInfo(),
      };
    }

    if (isStripeCard(paymentMethod)) {
      return {
        type:     paymentType,
        stripe:   this.props.stripe,
        elements: this.props.elements,
        cardName: formData['payment.cardName'],
        customerInfo: this.getStripeCustomerInfo(),
      };
    }

    if (isXenditCard(paymentMethod)) {
      const useFullNameField = !!paymentMethod.additionalSettings.useFullNameField;
      const cardFirstName = useFullNameField ? formData['payment.cardFullName'] : formData['payment.cardFirstName'];
      const cardLastName = useFullNameField ? formData['payment.cardFullName'] : formData['payment.cardLastName'];

      return {
        type: paymentType,
        cardFirstName,
        cardLastName,
        cardNumber: formData['payment.cardNumber'],
        cardExpiryMonth: formData['payment.cardExpiryMonth'],
        cardExpiryYear: '20' + formData['payment.cardExpiryYear'],
        cardSecurityCode: formData['payment.cardSecurityCode'],
        customerInfo: this.getXenditCustomerInfo(),
      };
    }
    
    if (isCreditCard(paymentMethod)) {
      return {
        type:             paymentType,
        cardName:         formData['payment.cardName'],
        cardNumber:       formData['payment.cardNumber'],
        cardExpiryMonth:  formData['payment.cardExpiryMonth'],
        cardExpiryYear:   '20' + formData['payment.cardExpiryYear'],
        cardSecurityCode: formData['payment.cardSecurityCode'],
      };
    }

    if (isStripeBecs(paymentMethod)) {
      return {
        type:     paymentType,
        stripe:   this.props.stripe,
        elements: this.props.elements,
        accountName: formData['payment.accountName'],
        customerInfo: this.getStripeCustomerInfo(),
      };
    }
    
    if (isNzDirectDebit(paymentMethod)) {
      return {
        type:          paymentType,
        accountName:   formData['payment.accountName'],
        bankCode:      formData['payment.bankCode'],
        branchCode:    formData['payment.branchCode'],
        accountNumber: formData['payment.accountNumber'],
        suffixCode:    formData['payment.suffixCode'],
      };
    }
    
    if (isHkDirectDebit(paymentMethod)) {
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
    }
    
    if (isCaDirectDebit(paymentMethod)) {
      return {
        type:          paymentType,
        accountName:   formData['payment.accountName'],
        bankCode:      formData['payment.bankCode'],
        branchCode:    formData['payment.branchCode'],
        accountNumber: formData['payment.accountNumber'],
      };
    }
    
    if (isAuDirectDebit(paymentMethod)) {
      return {
        type:          paymentType,
        accountName:   formData['payment.accountName'],
        accountBSB:    formData['payment.accountBSB'],
        accountNumber: formData['payment.accountNumber'],
      };
    }

    if (isXenditVirtualAccount(paymentMethod)) {
      return {
        type: paymentType,
        accountName: formData['payment.accountName'], // virtual account payment channel
      };
    }

    if (paymentType === 'na') {
      return { type: paymentType };
    }

    throw new Error(`[Clarety] unhandled 'getPaymentData' for paymentType: ${paymentType}`);
  }

  getPaymentMethodKey(paymentMethod) {
    return PaymentGatewayVersion.min(2)
      ? `gateway--${paymentMethod.gateway}--${paymentMethod.type}`
      : paymentMethod.type;
  }

  getSelectedPaymentMethod() {
    const { modalPaymentMethod, formData } = this.props;
    const paymentType = modalPaymentMethod?.type || formData['payment.type'];
    return this.getPaymentMethod(paymentType);
  }

  getPaymentMethod(type) {
    const { paymentMethods, modalPaymentMethod } = this.props;

    if (modalPaymentMethod?.type === type) {
      return modalPaymentMethod;
    }

    if (PaymentGatewayVersion.min(2)) {
      const [_, gatewayKey, paymentMethodType] = type.split('--');
      return this.props.paymentMethods.find(method => method.gateway === gatewayKey && method.type === paymentMethodType);
    } else {
      // for 'wallet' types the gateway is also included in the type key.
      let gateway = null;
      if (type && type.startsWith('wallet--')) {
        gateway = type.split('--')[1];
        type = 'wallet';
      }

      return paymentMethods.find(method => method.type === type && (!gateway || method.gateway === gateway));
    }
  }

  getAvailablePaymentMethodOptions() {
    if (PaymentGatewayVersion.min(2)) {
      return this.props.paymentMethods.map((paymentMethod) => ({
        value: this.getPaymentMethodKey(paymentMethod),
        label: t(toTranslationKey(paymentMethod.label), paymentMethod.label),
      }));
    } else {
      return this.props.paymentMethods.map((paymentMethod) => ({
        value: paymentMethod.type === 'wallet'
          ? `wallet--${paymentMethod.gateway}`
          : paymentMethod.type,
        label: t(toTranslationKey(paymentMethod.label), paymentMethod.label),
      }));
    }
  }

  getTitleText() {
    const { settings } = this.props;
    return settings.title || t('payment-details', 'Payment Details');
  }

  getSubmitBtnText() {
    const { settings } = this.props;
    return settings.submitBtnText || t('pay', 'Pay Now');
  }

  getStripeCustomerInfo() {
    const { formData } = this.props;

    let name = undefined;
    if (formData['customer.firstName'] || formData['customer.lastName']) {
      name = [formData['customer.firstName'], formData['customer.lastName']].join(' ');
    }
    
    return {
      name: name,
      email: formData['customer.email'],
      phone: formData['customer.mobile'],
      address: {
        line1: formData['customer.billing.address1'],
        line2: formData['customer.billing.address2'],
        city: formData['customer.billing.suburb'],
        state: formData['customer.billing.state'],
        country: formData['customer.billing.country'],
        postal_code: formData['customer.billing.postcode'],
      },
    };
  }

  getXenditCustomerInfo() {
    const { formData } = this.props;

    return {
      email: formData['payment.email'] || formData['customer.email'],
      phone: formData['customer.mobile'],
    };
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
    const { layout, isBusy, cartStatus } = this.props;
    const paymentMethod = this.getSelectedPaymentMethod();
    if (!paymentMethod) return null;

    if (this.isAuthorizingHKDirectDebit()) {
      return this.renderHKAuthorise();
    }

    if (cartStatus === 'transfer-code') {
      return this.renderTransferCode();
    }

    return (
      <React.Fragment>
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderCartSummary()}
          {this.renderErrorMessages()}
          {this.renderPaymentMethodOptions()}
          {this.renderPaymentFields(paymentMethod)}
          {this.renderTermsCheckbox()}
          {this.renderCaptcha()}
        </PanelBody>

        {this.renderFooter()}

        {this.props.modalPaymentMethod &&
          this.renderModalPaymentMethod()
        }
      </React.Fragment>
    );
  }

  renderModalPaymentMethod() {
    const { modalPaymentMethod, onCloseModalPaymentMethod, isBusy } = this.props;
    const busyStyle = { pointerEvents: 'none' };

    return (
      <Modal show onHide={onCloseModalPaymentMethod} className="modal-payment-method">
        <Modal.Header>
          <Modal.Title>{t(modalPaymentMethod.label, modalPaymentMethod.label)}</Modal.Title>
        </Modal.Header>
          
        <Modal.Body style={isBusy ? busyStyle : undefined}>
          {this.renderErrorMessages()}
          {this.renderPaymentFields(modalPaymentMethod)}
        </Modal.Body>
  
        <Modal.Footer style={isBusy ? busyStyle : undefined}>
          <Button
            variant="link"
            onClick={onCloseModalPaymentMethod}
            block
          >
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={this.onPressNext}
            isBusy={isBusy}
            block
          >
            {t('submit', 'Submit')}
          </Button>
        </Modal.Footer>
      </Modal>
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

  renderCaptcha() {
    const { turnstileSiteKey } = this.props;
  
    if (turnstileSiteKey) {
      return (
        <Row>
          <Col className="col-turnstile">
            <Turnstile siteKey={turnstileSiteKey} />
          </Col>
        </Row>
      );
    }

    return null;
  }

  renderLoading() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  renderPaymentMethodOptions() {
    const options = this.getAvailablePaymentMethodOptions();

    // Don't display selector if there's only one option.
    if (options.length <= 1) return null;

    return (
      <div className="payment-method-select">
        <ToggleButtonGroup
          type="radio"
          name="payment-method"
          value={this.props.formData['payment.type']}
          onChange={this.onSelectPaymentType}
        >
          {options.map(opt =>
            <ToggleButton key={opt.value} value={opt.value} variant="outline-secondary">{opt.label}</ToggleButton>
          )}
        </ToggleButtonGroup>
      </div>
    );
  }

  renderPaymentFields(paymentMethod) {
    if (isStripeCard(paymentMethod)) {
      return this.renderStripeCardFields(paymentMethod);
    }

    if (isXenditCard(paymentMethod)) {
      return this.renderXenditCardFields(paymentMethod);
    }
    
    if (isCreditCard(paymentMethod)) {
      return this.renderCreditCardFields(paymentMethod);
    }

    if (isStripeBecs(paymentMethod)) {
      return this.renderStripeBecsFields(paymentMethod);
    }
    
    if (isNzDirectDebit(paymentMethod)) {
      return this.renderNZDirectDebitFields(paymentMethod);
    }
    
    if (isHkDirectDebit(paymentMethod)) {
      return this.renderHKDirectDebitFields(paymentMethod);
    }
    
    if (isCaDirectDebit(paymentMethod)) {
      return this.renderCADirectDebitFields(paymentMethod);
    }
    
    if (isAuDirectDebit(paymentMethod)) {
      return this.renderAUDirectDebitFields(paymentMethod);
    }

    if (isPayPal(paymentMethod)) {
      return this.renderPayPalFields(paymentMethod);
    }

    if (isStripePaymentForm(paymentMethod)) {
      return this.renderStripePaymentForm(paymentMethod);
    }

    if (isXenditVirtualAccount(paymentMethod)) {
      return this.renderXenditVirtualAccount(paymentMethod);
    }

    if (isNoPayment(paymentMethod)) {
      return this.renderNoPaymentFields(paymentMethod);
    }

    console.error("[Clarety] unhandled 'renderPaymentFields' for paymentMethod", paymentMethod);
    throw new Error("[Clarety] unhandled 'renderPaymentFields'");
  }

  renderCardNumberLabel(paymentMethod) {
    return (
      <Label required>
        {t('card-number', 'Card Number')}
      </Label>
    );
  }

  renderCreditCardFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="cardName">
              <Label required>{t('card-name', 'Name on Card')}</Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              {this.renderCardNumberLabel(paymentMethod)}
              <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Label required>{t('card-expiry', 'Expiry')}</Label>
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
              <Label required>{t('card-ccv', 'CVC')}</Label>
              {this.renderCvcInfoBtn()}
              <CcvInput field="payment.cardSecurityCode" testId="ccv-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        {this.renderCvcInfo()}
      </React.Fragment>
    );
  }

  renderXenditCardFields(paymentMethod) {
    const useFullNameField = !!paymentMethod.additionalSettings.useFullNameField;

    return (
      <React.Fragment>
        {useFullNameField
          ? <Form.Row>
              <Col>
                <Form.Group controlId="cardFullName">
                  <Label required>{t('card-full-name', 'Cardholder Full Name')}</Label>
                  <TextInput field="payment.cardFullName" />
                </Form.Group>
              </Col>
            </Form.Row>
          : <Form.Row>
              <Col>
                <Form.Group controlId="cardFirstName">
                  <Label required>{t('card-first-name', 'Cardholder First Name')}</Label>
                  <TextInput field="payment.cardFirstName" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="cardLastName">
                  <Label required>{t('card-last-name', 'Cardholder Last Name')}</Label>
                  <TextInput field="payment.cardLastName" />
                </Form.Group>
              </Col>
            </Form.Row>
        }

        {this.showXenditCardEmailField() &&
          <Form.Row>
            <Col>
              <Form.Group controlId="paymentEmail">
                <Label required>{t('card-email', 'Cardholder Email')}</Label>
                <TextInput field="payment.email" />
              </Form.Group>
            </Col>
          </Form.Row>
        }

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              {this.renderCardNumberLabel(paymentMethod)}
              <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Label required>{t('card-expiry', 'Expiry')}</Label>
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
              <Label required>{t('card-ccv', 'CVC')}</Label>
              {this.renderCvcInfoBtn()}
              <CcvInput field="payment.cardSecurityCode" testId="ccv-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        {this.renderCvcInfo()}
      </React.Fragment>
    );
  }

  renderAUDirectDebitFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Label required>{t('account-name', 'Account Name')}</Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="accountBSB">
              <Label required>{t('account-bsb', 'Account BSB')}</Label>
              <BsbInput field="payment.accountBSB" testId="account-bsb-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Label required>{t('account-number', 'Account Number')}</Label>
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
              <Label required>{t('account-name', 'Account Name')}</Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Label required>{t('account-number', 'Account Number')}</Label>

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
              <Label required>{t('account-name', 'Account Name')}</Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="bankCode">
              <Label required>{t('bank-code', 'Bank Code')}</Label>
              <NumberInput field="payment.bankCode" maxLength={3} testId="bank-code-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Label required>{t('account-number', 'Account Number')}</Label>
              <AccountNumberInput field="payment.accountNumber" maxLength={12} testId="account-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="verificationType">
              <Label required>{t('verification-type', 'Verification Type')}</Label>
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
              <Label required>{t('verification-number', 'Verification Number')}</Label>
              <TextInput field="payment.verificationNumber" testId="verification-number-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="verificationMobile">
              <Label required>{t('verification-mobile', 'Verification Mobile')}</Label>
              <PhoneInput field="payment.verificationMobile" testId="verification-mobile-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderCADirectDebitFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Label required>{t('account-name', 'Account Name')}</Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={3}>
            <Form.Group controlId="bankCode">
              <Label required>{t('bank-number', 'Bank Number')}</Label>
              <NumberInput field="payment.bankCode" maxLength={3} testId="bank-code-input" />
            </Form.Group>
          </Col>

          <Col sm={3}>
            <Form.Group controlId="branchCode">
              <Label required>{t('transit-code', 'Transit Code')}</Label>
              <NumberInput field="payment.branchCode" maxLength={5} testId="branch-code-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Label required>{t('account-number', 'Account Number')}</Label>
              <AccountNumberInput field="payment.accountNumber" maxLength={12} testId="account-number-input" />
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
              <Label required>{t('account-name', 'Account Name')}</Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="account">
              <Label required>{t('account', 'Account')}</Label>
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

  /** @deprecated use renderStripeCardFields */
  renderStripeFields(paymentMethod) {
    return this.renderStripeCardFields(paymentMethod);
  }

  renderStripeCardFields(paymentMethod) {
    const { settings } = this.props;
    const style = settings.stripeStyle || { base: { fontSize: '16px' } };

    return (
      <React.Fragment>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardName">
              <Label required>{t('card-name', 'Name on Card')}</Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              {this.renderCardNumberLabel(paymentMethod)}
              <CardNumberElement
                options={{ style, placeholder: '•••• •••• •••• ••••' }}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Label required>{t('card-expiry', 'Expiry')}</Label>
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
              <Label required>{t('card-ccv', 'CVC')}</Label>
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

  renderStripePaymentForm(paymentMethod) {
    return (
      <StripePaymentForm
        paymentMethod={paymentMethod}
        customerInfo={this.getStripeCustomerInfo()}
      />
    );
  }

  renderXenditVirtualAccount(paymentMethod) {
    const xenditPaymentChannels = paymentMethod.additionalSettings.paymentChannels || [];

    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="bank">
              <Label required>{t('bank', 'Bank')}</Label>
              <SelectInput
                field="payment.accountName"
                options={xenditPaymentChannels.map((channel) => ({
                  value: channel,
                  label: t(channel, channel),
                }))}
              />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  // Override in subclass to provide the appropriate PayPal button.
  // for example see registration/components/panels/PaymentPanel.js
  renderPayPalFields(paymentMethod) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        Sorry, payment via PayPal is currently unavailable.
      </div>
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

    const paymentType = this.props.formData['payment.type'];

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
            {paymentType !== 'wallet--paypal' &&
              <SubmitButton
                title={this.getSubmitBtnText()}
                testId="next-button"
              />
            }
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
                <Label required>
                  {t('payment-auth-code', 'Please enter the authorisation code sent to your device')}
                </Label>
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

  renderTransferCode() {
    const paymentMethod = this.getSelectedPaymentMethod();

    if (isXenditVirtualAccount(paymentMethod)) {
      return this.renderXenditVirtualAccountTransferCode();
    }

    return null;
  }

  renderXenditVirtualAccountTransferCode() {
    const { layout, isBusy, amount, settings, cartPayment } = this.props;
    const { copiedTransferCode } = this.state;
    const hideCents = settings.hideCents && Number.isInteger(parseFloat(amount));

    return (
      <PanelBody layout={layout} status="edit" isBusy={isBusy}>
        <p class="transfer-prompt">
          {t('virtual-account-transfer-prompt', 'To complete your payment, please make the following transfer:')}
        </p>

        <table class="table table-striped">
          <tbody>
            <tr>
              <td>{t('bank', 'Bank')}</td>
              <td>{t(cartPayment.accountName, cartPayment.accountName)}</td>
            </tr>
            <tr>
              <td>{t('virtual-account-number', 'Virtual Account Number')}</td>
              <td>
                {cartPayment.transferCode}
                {' '}
                <a href="#" onClick={this.onPressCopyTransferCode}>
                  {copiedTransferCode ? t('copied', 'Copied') : t('copy', 'Copy')}
                </a>
              </td>
            </tr>
            <tr>
              <td>{t('amount', 'Amount')}</td>
              <td><Currency amount={amount} hideCents={hideCents} /></td>
            </tr>
          </tbody>
        </table>
      </PanelBody>
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
