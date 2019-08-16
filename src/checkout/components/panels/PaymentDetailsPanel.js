import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, CardNumberInput, CcvInput, ExpiryInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { makePayment, editPanel, paymentMethods } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PaymentDetailsPanel extends BasePanel {
  onPressPayNow = event => {
    event.preventDefault();

    const { paymentMethod, makePayment } = this.props;

    if (this.validate()) {
      makePayment(this.state.formData, paymentMethod);
    }
  };

  validate() {
    const { paymentMethod } = this.props;

    const errors = [];

    switch (paymentMethod.method) {
      case paymentMethods.creditCard:
        this.validateCreditCardFields(errors);
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

  componentDidUpdate(prevProps) {
    const { errors } = this.props;
    if (prevProps.errors !== errors) {
      this.setState({ errors });
    }
  }

  renderWait() {
    return (
      <WaitPanelHeader number="5" title="Payment Details" />
    );
  }

  renderEdit() {
    return (
      <div className="panel">
        <EditPanelHeader number="5" title="Payment Details" />

        <FormContext.Provider value={this.state}>
          <Form onSubmit={this.onPressPayNow}>
            {this.renderPaymentMethodFields()}

            <Form.Row>
              <Col>
                By clicking the <strong>Pay Now</strong> button, you’re acknowledging that you’ve read and accept the <a href="#">Terms &amp; Conditions</a>.
              </Col>
            </Form.Row>

            <div className="text-right mt-3">
              <Button title="Pay Now" type="submit" isBusy={this.props.isBusy} />
            </div>
          </Form>
        </FormContext.Provider>
      </div>
    );
  }

  renderPaymentMethodFields() {
    const { paymentMethod } = this.props;

    switch (paymentMethod.method) {
      case paymentMethods.creditCard: return this.renderCreditCardFields();
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
    const cardNumber = this.state.formData['cardNumber'];

    return (
      <DonePanelHeader
        number="5"
        title={cardNumber}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.checkout.isBusy,
    errors: state.checkout.errors,
    // TODO: handle multiple payment methods.
    paymentMethod: state.checkout.paymentMethods[0],
  };
};

const actions = {
  makePayment: makePayment,
  editPanel: editPanel,
};

export const PaymentDetailsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_PaymentDetailsPanel);
