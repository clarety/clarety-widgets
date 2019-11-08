import React from 'react';
import { Form, Col, Spinner } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext } from 'shared/utils';
import { ErrorMessages } from 'form/components';
import { BasePanel, TextInput, CardNumberInput, CcvInput, ExpiryInput, Button } from 'checkout/components';

export class PaymentPanel extends BasePanel {
  onPressPlaceOrder = event => {
    event.preventDefault();

    const { paymentMethod, makePayment } = this.props;

    if (this.validate()) {
      const paymentData = this.getPaymentData();
      makePayment(paymentData, paymentMethod);
    }
  };

  onShowPanel() {
    this.props.onShowPanel();
  }

  validate() {
    const { paymentMethod } = this.props;

    const errors = [];

    switch (paymentMethod.type) {
      case 'gatewaycc':
        this.validateCreditCardFields(errors);
        break;

      case 'na':
        break;
      
      default:
        throw new Error(`[Clarety] unhandled payment method ${paymentMethod}`);
    }

    this.setState({ errors });
    return errors.length === 0;
  }

  validateCreditCardFields(errors) {
    this.validateRequired('cardName', errors);
    this.validateCardNumber('cardNumber', errors);
    this.validateCardExpiry('cardExpiry', 'cardExpiryMonth', 'cardExpiryYear', errors);
    this.validateCcv('cardSecurityCode', errors);
  }

  getPaymentData() {
    const { paymentMethod } = this.props;
    const { formData } = this.state;

    if (paymentMethod.type === 'gatewaycc') {
      return {
        type:             'gatewaycc',
        cardName:         formData.cardName,
        cardNumber:       formData.cardNumber,
        cardExpiryMonth:  formData.cardExpiryMonth,
        cardExpiryYear:   '20' + formData.cardExpiryYear,
        cardSecurityCode: formData.cardSecurityCode,
      };
    }

    if (paymentMethod.type === 'na') {
      return { type: 'na' };
    }

    throw new Error(`[Clarety] unhandled payment method ${paymentMethod}`);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    const { errors } = this.props;
    if (prevProps.errors !== errors) {
      this.setState({ errors });
    }
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          title="Payment Details"
          number={index + 1}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, paymentMethod, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="payment-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Payment Details"
          intlId="paymentPanel.editTitle"
        />

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages />

          {this.renderCartSummary()}

          {paymentMethod
            ? this.renderForm()
            : this.renderSpinner()
          }
        </PanelBody>
      </PanelContainer>
    );
  }

  renderCartSummary() {
    // Override in subclass.
    return null;
  }

  renderForm() {
    const { isBusy, submitBtnTitle } = this.props;
    
    return (
      <FormContext.Provider value={this.state}>
        <Form onSubmit={this.onPressPlaceOrder}>
          {this.renderPaymentMethodFields()}

          <div className="panel-actions">
            <Button title={submitBtnTitle || 'Place Order'} type="submit" isBusy={isBusy} />
          </div>
        </Form>
      </FormContext.Provider>
    );
  }

  renderSpinner() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  renderPaymentMethodFields() {
    const { paymentMethod } = this.props;

    switch (paymentMethod.type) {
      case 'gatewaycc': return this.renderCreditCardFields();
      case 'na':        return null;

      default: throw new Error(`[Clarety] unhandled payment method ${paymentMethod}`);
    }
  }

  renderCreditCardFields() {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <TextInput label="Name On Card" field="cardName" required />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <CardNumberInput label="Card Number" field="cardNumber" required />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <ExpiryInput label="Expiry Date" field="cardExpiry" monthField="cardExpiryMonth" yearField="cardExpiryYear" required />
          </Col>
          <Col>
            <CcvInput label="CCV" field="cardSecurityCode" required />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDone() {
    const { layout, index } = this.props;
    const cardNumber = this.state.formData['cardNumber'];

    return (
      <PanelHeader
        status="done"
        layout={layout}
        number={index + 1}
        title={cardNumber}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}
