import React from 'react';
import { Card, Form, Col, Button } from 'react-bootstrap';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../shared/actions';
import { SubmitButton, ErrorMessages } from '../../form/components';
import { CardNumberInput, ExpiryInput, CcvInput } from '../../form/components';
import { createStripeToken, parseStripeError, validateCard } from '../utils/stripe-utils';
import { connectPaymentPanel } from '../utils/donate-utils';

export class PaymentPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onSubmit = event => {
    const { status, paymentData, setStatus, setErrors, clearErrors } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();

    const errors = validateCard(paymentData);
    if (errors) {
      setErrors(errors);
      setStatus(statuses.ready);
    } else {
      this.onValidate(paymentData);
    }
  };

  onValidate = async paymentData => {
    const { payment, stripeKey, setStatus, setErrors, setPayment } = this.props;

    if (payment.stripeToken) {
      this.attemptPayment();
    } else {
      const result = await createStripeToken(paymentData, stripeKey);

      if (result.error) {
        const errors = parseStripeError(result.error);
        setErrors(errors);
        setStatus(statuses.ready);
      } else {
        setPayment({ stripeToken: result.id });
        this.attemptPayment();
      }
    }
  };

  attemptPayment = async () => {
    const { formData, saleLines, payment, jwt, donation } = this.props;
    const { setStatus, setErrors, setDonation, history } = this.props;

    const endpoint = donation ? `donations/${donation.uuid}` : 'donations';

    const postData = { ...formData, saleLines, payment, jwt };

    const result = await ClaretyApi.post(endpoint, postData);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
        setDonation(result.donation);
        history.push('/success');
      }
    }

    setStatus(statuses.ready);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} data-testid="payment-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    return (
      <Card>
        <Card.Header className="text-center">
          Payment Details
        </Card.Header>
  
        <Card.Body>
          <ErrorMessages />
  
          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <CardNumberInput testId="card-number-input" />
          </Form.Group>
  
          <Form.Row>
            <Col>
              <Form.Group controlId="cardExpMonth">
                <Form.Label>Expiry</Form.Label>
                <ExpiryInput testId="expiry-input" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="ccv">
                <Form.Label>CCV</Form.Label>
                <CcvInput testId="ccv-input" />
              </Form.Group>
            </Col>
          </Form.Row>
        </Card.Body>
  
        <Card.Footer>
          <Form.Row>
            <Col xs={4}>
              <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
            </Col>
            <Col xs={8}>
              <SubmitButton title="Donate" block testId="donate-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export default connectPaymentPanel(PaymentPanel);
