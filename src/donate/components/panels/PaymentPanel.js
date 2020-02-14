import React from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { cardNumberField, cardExpiryField, ccvField } from 'shared/utils';
import { SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput } from 'form/components';

export class PaymentPanel extends BasePanel {
  onShowPanel() {
    this.props.onShowPanel();

    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { paymentMethod, onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;
    
    const paymentData = this.getPaymentData();
    const didSubmit = await onSubmit(paymentData, paymentMethod);
    if (!didSubmit) return;

    nextPanel();
  };

  validate() {
    const { paymentMethod, setErrors } = this.props;

    const errors = [];

    switch (paymentMethod.type) {
      case 'gatewaycc': this.validateCreditCardFields(errors); break;
      case 'na':        this.validateNoPaymentFields(errors);  break;

      default: throw new Error(`[Clarety] unhandled validate ${paymentMethod.type}`);
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

  validateNoPaymentFields(errors) {
    // NOTE: no validation required.
  }

  getPaymentData() {
    const { paymentMethod, formData } = this.props;

    if (paymentMethod.type === 'gatewaycc') {
      return {
        type:             'gatewaycc',
        cardName:         formData['customer.firstName'] + ' ' + formData['customer.lastName'],
        cardNumber:       formData['payment.cardNumber'],
        cardExpiryMonth:  formData['payment.cardExpiryMonth'],
        cardExpiryYear:   '20' + formData['payment.cardExpiryYear'],
        cardSecurityCode: formData['payment.cardSecurityCode'],
      };
    }

    if (paymentMethod.type === 'na') {
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
    const { layout, isBusy, index, paymentMethod, settings } = this.props;

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

          <PanelBody layout={layout} status="edit" isBusy={isBusy}>
            <ErrorMessages />
            {this.renderCartSummary()}

            {paymentMethod
              ? this.renderPaymentFields()
              : this.renderLoading()
            }
          </PanelBody>
    
          {layout !== 'page' &&
            <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
              <Form.Row className="justify-content-center">
                  <Col xs={4}>
                    {layout === 'tabs' && <BackButton title="Back" onClick={this.onPressBack} />}
                  </Col>
                <Col xs={8}>
                  <SubmitButton title={settings.submitButtonText || 'Pay Now'} testId="next-button" />
                </Col>
              </Form.Row>
            </PanelFooter>
          }
        </PanelContainer>
      </form>
    );
  }

  renderCartSummary() {
    return (
      <p className="donation-summary">
        Donation Amount: <b>{this.props.amount}</b>
      </p>
    );
  }

  renderLoading() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  renderPaymentFields() {
    switch (this.props.paymentMethod.type) {
      case 'gatewaycc': return this.renderCreditCardFields();
      case 'na':        return this.renderNoPaymentFields();

      default: throw new Error(`[Clarety] unhandled render ${paymentMethod.type}`);
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
