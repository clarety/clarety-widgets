import React from 'react';
import { Form, Row, Col, Spinner, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, injectStripe } from 'shared/components';
import { requiredField, cardNumberField, cardExpiryField, ccvField } from 'shared/utils';
import { TextInput, SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput, AccountNumberInput, BsbInput, NZAccountNumberInput } from 'form/components';

export class _PaymentPanel extends BasePanel {
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

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;
    
    const paymentData = this.getPaymentData();
    const didSubmit = await onSubmit(paymentData);
    if (!didSubmit) return;

    nextPanel();
  };

  validate() {
    const { setErrors, formData } = this.props;
    const paymentMethod = this.getPaymentMethod(formData['payment.type']);

    const errors = [];    
    this.validateFields(paymentMethod, errors);

    setErrors(errors);
    return errors.length === 0;
  }

  validateFields(paymentMethod, errors) {
    if (paymentMethod.type === 'gatewaycc') {
      if (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') {
        return this.validateStripeFields(errors);
      } else {
        return this.validateCreditCardFields(errors);
      }
    }
    
    if (paymentMethod.type === 'gatewaydd') {
      if (paymentMethod.gateway === 'nz') {
        return this.validateNZDirectDebitFields(errors);
      } else {
        return this.validateDirectDebitFields(errors);
      }
    }
    
    if (paymentMethod.type === 'na') {
      return this.validateNoPaymentFields(errors);
    }

    throw new Error(`[Clarety] unhandled 'validate' for paymentMethod.type: ${paymentMethod.type}`);
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

  validateNoPaymentFields(errors) {
    // NOTE: no validation required.
  }

  getPaymentData() {
    const { formData } = this.props;

    const paymentType = formData['payment.type'];
    const paymentMethod = this.getPaymentMethod(paymentType);

    if (paymentType === 'gatewaycc') {
      if (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') {
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

    if (paymentType === 'gatewaydd') {
      if (paymentMethod.gateway === 'nz') {
        return {
          type:          paymentType,
          accountName:   formData['payment.accountName'],
          bankCode:      formData['payment.bankCode'],
          branchCode:    formData['payment.branchCode'],
          accountNumber: formData['payment.accountNumber'],
          suffixCode:    formData['payment.suffixCode'],
        };
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

  getPaymentMethod(type) {
    return this.props.paymentMethods.find(method => method.type === type);
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="payment-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title || t('paymentPanel.waitTitle', 'Payment Details')}
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
        title={settings.title || t('paymentPanel.editTitle', 'Payment Details')}
      />
    );
  }

  renderContent() {
    const { layout, isBusy, formData } = this.props;
    const paymentMethod = this.getPaymentMethod(formData['payment.type']);
    if (!paymentMethod) return null;

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

  renderPaymentMethodOptions() {
    const showCC = !!this.getPaymentMethod('gatewaycc');
    const showDD = !!this.getPaymentMethod('gatewaydd');

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
          {showCC && <ToggleButton value="gatewaycc" variant="outline-secondary">{t('label.payment.creditCard', 'Credit Card')}</ToggleButton>}
          {showDD && <ToggleButton value="gatewaydd" variant="outline-secondary">{t('label.payment.directDebit', 'Direct Debit')}</ToggleButton>}
        </ToggleButtonGroup>
      </div>
    );
  }

  renderPaymentFields(paymentMethod) {
    if (paymentMethod.type === 'gatewaycc') {
      if (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') {
        return this.renderStripeFields(paymentMethod);
      } else {
        return this.renderCreditCardFields(paymentMethod);
      }
    }

    if (paymentMethod.type === 'gatewaydd') {
      if (paymentMethod.gateway === 'nz') {
        return this.renderNZDirectDebitFields(paymentMethod);
      } else {
        return this.renderDirectDebitFields(paymentMethod);
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
              <Form.Label>{t('label.payment.cardName', 'Card Name')}</Form.Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              <Form.Label>{t('label.payment.cardNumber', 'Card Number')}</Form.Label>
              <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>{t('label.payment.cardExpiry', 'Expiry')}</Form.Label>
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
              <Form.Label>{t('label.payment.cardCcv', 'CVC')}</Form.Label>
              <CcvInput field="payment.cardSecurityCode" testId="ccv-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDirectDebitFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="accountName">
              <Form.Label>{t('label.payment.accountName', 'Account Name')}</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="accountBSB">
              <Form.Label>{t('label.payment.accountBSB', 'Account BSB')}</Form.Label>
              <BsbInput field="payment.accountBSB" testId="account-bsb-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Form.Label>{t('label.payment.accountNumber', 'Account Number')}</Form.Label>
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
              <Form.Label>{t('label.payment.accountName', 'Account Name')}</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>{t('label.payment.accountNumber', 'Account Number')}</Form.Label>

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

  renderStripeFields(paymentMethod) {
    const { settings } = this.props;
    const style = settings.stripeStyle || { base: { fontSize: '16px' } };

    return (
      <React.Fragment>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardName">
              <Form.Label>{t('label.payment.cardName', 'Card Name')}</Form.Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              <Form.Label>{t('label.payment.cardNumber', 'Card Number')}</Form.Label>
              <CardNumberElement options={{ style }} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>{t('label.payment.cardExpiry', 'Expiry')}</Form.Label>
              <CardExpiryElement options={{ style }} />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="ccv">
              <Form.Label>{t('label.payment.cardCcv', 'CVC')}</Form.Label>
              <CardCvcElement options={{ style }} />
            </Form.Group>
          </Col>
        </Form.Row>

      </React.Fragment>
    );
  }

  renderNoPaymentFields() {
    return (
      <p>{t('paymentPanel.noPaymentMessage', 'Your order is free, no payment is required.')}</p>
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
                title={settings.backBtnText || t('btn.back', 'Back')}
                onClick={this.onPressBack}
              />
            </Col>
          }

          <Col xs={layout === 'tabs' ? 6 : 12}>
            <SubmitButton
              title={settings.submitBtnText || t('btn.pay', 'Pay Now')}
              testId="next-button"
            />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="payment-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title || t('paymentPanel.doneTitle', 'Payment Details')}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}

export const PaymentPanel = injectStripe(_PaymentPanel);
