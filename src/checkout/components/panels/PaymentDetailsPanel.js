import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Spinner } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses } from 'shared/actions';
import { BasePanel, TextInput, CardNumberInput, CcvInput, ExpiryInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { paymentMethods, fetchPaymentMethods, makePayment } from 'checkout/actions';
import { getPaymentMethod } from 'checkout/selectors';
import { FormContext } from 'checkout/utils';

class _PaymentDetailsPanel extends BasePanel {
  onPressPayNow = event => {
    event.preventDefault();

    const { paymentMethod, makePayment } = this.props;

    if (this.validate()) {
      makePayment(this.state.formData, paymentMethod);
    }
  };

  onShowPanel() {
    this.props.fetchPaymentMethods();
  }

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

        {paymentMethod
          ? this.renderForm()
          : this.renderSpinner()
        }
      </div>
    );
  }

  renderForm() {
    const { isBusy } = this.props;
    
    return (
      <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
        <FormContext.Provider value={this.state}>
          <Form onSubmit={this.onPressPayNow}>
            {this.renderPaymentMethodFields()}

            <div className="text-right mt-3">
              <Button title="Pay Now" type="submit" isBusy={isBusy} />
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

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
    errors: state.errors,
    paymentMethod: getPaymentMethod(state),
  };
};

const actions = {
  fetchPaymentMethods: fetchPaymentMethods,
  makePayment: makePayment,
};

export const PaymentDetailsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_PaymentDetailsPanel);
