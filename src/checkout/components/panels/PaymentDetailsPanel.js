import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { RxBasePanel, RxTextInput, RxCardNumberInput, RxCcvInput, RxExpiryInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, makePayment, editPanel, paymentMethods, setErrors } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';

class _PaymentDetailsPanel extends RxBasePanel {
  onPressPayNow = event => {
    event.preventDefault();

    const { paymentMethod, makePayment } = this.props;

    if (this.validate()) {
      makePayment(paymentMethod);
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

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateCreditCardFields(errors) {
    this.validateRequired('payment.cardName', errors);
    this.validateCardNumber('payment.cardNumber', errors);
    this.validateCardExpiry('payment.expiry', 'payment.expiryMonth', 'payment.expiryYear', errors);
    this.validateCcv('payment.ccv', errors);
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
    const { isBusy } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number="5" title="Payment Details" />

        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          <Form onSubmit={this.onPressPayNow}>
            {this.renderPaymentMethodFields()}

            <div className="text-right mt-3">
              <Button title="Pay Now" type="submit" isBusy={isBusy} />
            </div>
          </Form>
        </BlockUi>
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
            <RxTextInput field="payment.cardName" placeholder="Name On Card *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <RxCardNumberInput field="payment.cardNumber" placeholder="Card Number *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>Expiry Date *</Col>
          <Col>CCV *</Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <RxExpiryInput field="payment.expiry" monthField="payment.expiryMonth" yearField="payment.expiryYear" />
          </Col>
          <Col>
            <RxCcvInput field="payment.ccv" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDone() {
    const cardNumber = this.props.formData['payment.cardNumber'];

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
    isBusy: state.status === statuses.busy,
    errors: state.errors,
    paymentMethod: getPaymentMethod(state),
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  makePayment: makePayment,
  editPanel: editPanel,
  setErrors: setErrors,
};

export const PaymentDetailsPanel = connect(mapStateToProps, actions)(_PaymentDetailsPanel);
