import React from 'react';
import { Form, Row, Col, Spinner, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, injectStripe } from 'shared/components';
import { requiredField, cardNumberField, cardExpiryField, ccvField } from 'shared/utils';
import { TextInput, SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput, AccountNumberInput, BsbInput } from 'form/components';

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
    const paymentType = formData['payment.type'];
    const paymentMethod = this.getPaymentMethod(paymentType);

    const errors = [];

    if (paymentType === 'gatewaycc') {
      if (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') {
        this.validateStripeFields(errors);
      } else {
        this.validateCreditCardFields(errors);
      }
    } else if (paymentType === 'gatewaydd') {
      this.validateDirectDebitFields(errors);
    } else if (paymentType === 'na') {
      this.validateNoPaymentFields(errors);
    } else {
      throw new Error(`[Clarety] unhandled 'validate' for paymentType: ${paymentType}`);
    }

    setErrors(errors);
    return errors.length === 0;
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
      return {
        type:          paymentType,
        accountName:   formData['payment.accountName'],
        accountBSB:    formData['payment.accountBSB'],
        accountNumber: formData['payment.accountNumber'],
      };
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
          title={settings.title}
          intlId="paymentPanel.waitTitle"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, paymentMethods, settings } = this.props;

    return (
      <form onSubmit={this.onPressNext} data-testid="payment-panel">
        <PanelContainer layout={layout} status="edit" className="payment-panel">
          {!settings.hideHeader &&
            <PanelHeader
              status="edit"
              layout={layout}
              number={index + 1}
              title={settings.title}
              intlId="paymentPanel.editTitle"
            />
          }

          {paymentMethods
            ? this.renderContent()
            : this.renderLoading()
          }
          
        </PanelContainer>
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy, settings } = this.props;

    return (
      <React.Fragment>
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {layout !== 'page' && <ErrorMessages />}
          {this.renderCartSummary()}
          {this.renderPaymentMethodOptions()}
          {this.renderPaymentFields()}
          {this.renderTermsCheckbox()}
        </PanelBody>
  
        {layout !== 'page' &&
          <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
            <Form.Row className="justify-content-center">
              {layout === 'tabs' && 
                <Col xs={4}>
                  <BackButton title="Back" onClick={this.onPressBack} />
                </Col>
              }

              <Col xs={layout === 'tabs' ? 8 : 12}>
                <SubmitButton title={settings.submitBtnText || 'Pay Now'} testId="next-button" />
              </Col>
            </Form.Row>
          </PanelFooter>
        }
      </React.Fragment>
    );
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
          {showCC && <ToggleButton value="gatewaycc" variant="outline-info">Credit Card</ToggleButton>}
          {showDD && <ToggleButton value="gatewaydd" variant="outline-info">Direct Debit</ToggleButton>}
        </ToggleButtonGroup>
      </div>
    );
  }

  renderPaymentFields() {
    const paymentType = this.props.formData['payment.type'];
    const paymentMethod = this.getPaymentMethod(paymentType);

    if (paymentType === 'gatewaycc') {
      if (paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca') {
        return this.renderStripeFields(paymentMethod);
      } else {
        return this.renderCreditCardFields(paymentMethod);
      }
    }

    if (paymentType === 'gatewaydd') {
      return this.renderDirectDebitFields(paymentMethod);
    }

    if (paymentType === 'na') {
      return this.renderNoPaymentFields(paymentMethod);
    }

    throw new Error(`[Clarety] unhandled 'renderPaymentFields' for paymentType: ${paymentType}`);
  }

  renderCreditCardFields(paymentMethod) {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="cardName">
              <Form.Label>Card Name</Form.Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>Expiry</Form.Label>
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
              <Form.Label>CCV</Form.Label>
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
              <Form.Label>Account Name</Form.Label>
              <TextInput field="payment.accountName" testId="account-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm={6}>
            <Form.Group controlId="accountBSB">
              <Form.Label>Account BSB</Form.Label>
              <BsbInput field="payment.accountBSB" testId="account-bsb-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountNumber">
              <Form.Label>Account Number</Form.Label>
              <AccountNumberInput field="payment.accountNumber" testId="account-number-input" />
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
              <Form.Label>Card Name</Form.Label>
              <TextInput field="payment.cardName" testId="card-name-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <CardNumberElement options={{ style }} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>Expiry</Form.Label>
              <CardExpiryElement options={{ style }} />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="ccv">
              <Form.Label>CCV</Form.Label>
              <CardCvcElement options={{ style }} />
            </Form.Group>
          </Col>
        </Form.Row>

      </React.Fragment>
    );
  }

  renderNoPaymentFields() {
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
          title={settings.title}
          intlId="paymentPanel.doneTitle"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}

export const PaymentPanel = injectStripe(_PaymentPanel);
