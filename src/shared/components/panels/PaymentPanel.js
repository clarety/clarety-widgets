import React from 'react';
import { Form, Row, Col, Spinner, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, cardNumberField, cardExpiryField, ccvField } from 'shared/utils';
import { TextInput, SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput } from 'form/components';

export class PaymentPanel extends BasePanel {
  constructor(props) {
    super(props);
    this.selectFirstPaymentMethod();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    const { paymentMethods, updateFormData } = this.props;

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

  onSelectPaymentMethod = (paymentMethod) => {
    this.props.updateFormData('payment.type', paymentMethod);
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
    const paymentMethod = formData['payment.type'];

    const errors = [];

    switch (paymentMethod) {
      case 'gatewaycc': this.validateCreditCardFields(errors);  break;
      case 'gatewaydd': this.validateDirectDebitFields(errors); break;
      case 'na':        this.validateNoPaymentFields(errors);   break;

      default: throw new Error(`[Clarety] unhandled validate ${paymentMethod}`);
    }

    setErrors(errors);
    return errors.length === 0;
  }

  validateCreditCardFields(errors) {
    const { formData } = this.props;

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
    const paymentMethod = formData['payment.type'];

    if (paymentMethod === 'gatewaycc') {
      return {
        type:             'gatewaycc',
        cardName:         formData['customer.firstName'] + ' ' + formData['customer.lastName'],
        cardNumber:       formData['payment.cardNumber'],
        cardExpiryMonth:  formData['payment.cardExpiryMonth'],
        cardExpiryYear:   '20' + formData['payment.cardExpiryYear'],
        cardSecurityCode: formData['payment.cardSecurityCode'],
      };
    }

    if (paymentMethod === 'na') {
      return { type: 'na' };
    }

    throw new Error(`[Clarety] unhandled getPaymentData ${paymentMethod.type}`);
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
            <ErrorMessages />
            {this.renderCartSummary()}
            {this.renderPaymentMethodOptions()}
            {this.renderPaymentFields()}
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

  renderLoading() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  renderPaymentMethodOptions() {
    const { paymentMethods, formData } = this.props;

    // Don't display selector if there's only one option.
    if (paymentMethods.length === 1) {
      return null;
    }

    const showCC = !!paymentMethods.find(method => method.type === 'gatewaycc');
    const showDD = !!paymentMethods.find(method => method.type === 'gatewaydd');

    return (
      <div className="payment-method-select">
        <ToggleButtonGroup
          type="radio"
          name="payment-method"
          value={formData['payment.type']}
          onChange={this.onSelectPaymentMethod}
        >
          {showCC && <ToggleButton value="gatewaycc" variant="outline-info">Credit Card</ToggleButton>}
          {showDD && <ToggleButton value="gatewaydd" variant="outline-info">Direct Debit</ToggleButton>}
        </ToggleButtonGroup>
      </div>
    );
  }

  renderPaymentFields() {
    const paymentMethod = this.props.formData['payment.type'];

    switch (paymentMethod) {
      case 'gatewaycc': return this.renderCreditCardFields();
      case 'gatewaydd': return this.renderDirectDebitFields();
      case 'na':        return this.renderNoPaymentFields();

      default: throw new Error(`[Clarety] unhandled render ${paymentMethod}`);
    }
  }

  renderCreditCardFields() {
    return (
      <React.Fragment>
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

  renderDirectDebitFields() {
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
            <Form.Group controlId="accountNumber">
              <Form.Label>Account Number</Form.Label>
              <TextInput field="payment.accountNumber" testId="account-number-input" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="accountBSB">
              <Form.Label>Account BSB</Form.Label>
              <TextInput field="payment.accountBSB" testId="account-bsb-input" />
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
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
