import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { ClaretyApi } from 'shared/services';
import { statuses } from 'shared/actions';
import { scrollIntoView } from 'shared/utils';
import { SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput } from 'form/components';
import { StepIndicator } from 'donate/components';
import { connectPaymentPanel, createStripeToken, parseStripeError, validateCard } from 'donate/utils';
import 'react-block-ui/style.css';

export class _PaymentPanel extends React.Component {
  componentDidMount() {
    scrollIntoView(this);
  }

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

    if (payment.gatewayToken) {
      this.attemptPayment();
    } else {
      const result = await createStripeToken(paymentData, stripeKey);

      if (result.error) {
        const errors = parseStripeError(result.error);
        setErrors(errors);
        setStatus(statuses.ready);
      } else {
        setPayment({ gatewayToken: result.id });
        this.attemptPayment();
      }
    }
  };

  attemptPayment = async () => {
    const { formData, saleline, payment, history } = this.props;
    const { setStatus, setErrors, setSuccessResult } = this.props;

    const postData = { ...formData, saleline, payment };

    const result = await ClaretyApi.post('donations', postData);
    setStatus(statuses.ready);

    if (result) {
      if (result.validationErrors) {
        setErrors(result.validationErrors);
      } else {
        setSuccessResult(result);
        history.push('/success');
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} data-testid="payment-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { forceMd, isBusy } = this.props;

    return (
      <Card>
        <Card.Header className="text-center">
          <StepIndicator currentStep="payment" />
        </Card.Header>
  
        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={forceMd ? null : 8}>

              <ErrorMessages />

              <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>

                <Card.Text className="text-center">
                  Donation Amount: <b>{this.props.amount}</b>
                </Card.Text>
        
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

              </BlockUi>

            </Col>
          </Row>
        </Card.Body>
  
        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col xs={4} lg={forceMd ? null : 2}>
              <BackButton title="Back" onClick={this.onPrev} block />
            </Col>
            <Col xs={8} lg={forceMd ? null : 3}>
              <SubmitButton title="Donate" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export const PaymentPanel = connectPaymentPanel(_PaymentPanel);
