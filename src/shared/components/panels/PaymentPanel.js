import React from 'react';
import { Form, Col, Spinner } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { ErrorMessages } from 'form/components';
import { BasePanel, TextInput, CardNumberInput, CcvInput, ExpiryInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { FormContext } from 'checkout/utils';
// import 'react-block-ui/style.css';

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
    this.validateCardExpiry('expiry', 'expiryMonth', 'expiryYear', errors);
    this.validateCcv('ccv', errors);
  }

  getPaymentData() {
    const { paymentMethod } = this.props;

    if (paymentMethod.type === 'gatewaycc') {
      return {
        type:             'gatewaycc',
        cardName:         this.state.formData.cardName,
        cardNumber:       this.state.formData.cardNumber,
        cardExpiryMonth:  this.state.formData.expiryMonth,
        cardExpiryYear:   '20' + this.state.formData.expiryYear,
        cardSecurityCode: this.state.formData.ccv,
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
    const { index } = this.props;

    return (
      <WaitPanelHeader number={index + 1} title="Payment Details" />
    );
  }

  renderEdit() {
    const { index, paymentMethod } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number={index + 1} title="Payment Details" />

        <ErrorMessages />

        {this.renderCartSummary()}

        {paymentMethod
          ? this.renderForm()
          : this.renderSpinner()
        }
      </div>
    );
  }

  renderCartSummary() {
    // Override in subclass.
    return null;
  }

  renderForm() {
    const { isBusy, submitBtnTitle } = this.props;
    
    return (
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        <FormContext.Provider value={this.state}>
          <Form onSubmit={this.onPressPlaceOrder}>
            {this.renderPaymentMethodFields()}

            <div className="text-right mt-3">
              <Button title={submitBtnTitle || 'Place Order'} type="submit" isBusy={isBusy} />
            </div>
          </Form>
        </FormContext.Provider>
      </BlockUi>
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
            <TextInput field="cardName" placeholder="Name On Card *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <CardNumberInput field="cardNumber" placeholder="Card Number *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>Expiry Date *</Col>
          <Col>CCV *</Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <ExpiryInput field="expiry" monthField="expiryMonth" yearField="expiryYear" />
          </Col>
          <Col>
            <CcvInput field="ccv" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDone() {
    const { index } = this.props;
    const cardNumber = this.state.formData['cardNumber'];

    return (
      <DonePanelHeader
        number={index + 1}
        title={cardNumber}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}
