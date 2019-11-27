import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { CardNumberInput, ExpiryInput, CcvInput, SubmitButton } from 'form/components';
import { _PaymentPanel } from 'donate/components';
import { connectPaymentPanel } from 'donate/utils';

export class _PagePaymentPanel extends _PaymentPanel {
  fields = [
    'payment.cardNumber',
    'payment.expiry',
    'payment.ccv',
  ];

  componentDidMount() {
  }

  componentDidUpdate() {
    if (this.hasError()) this.scrollIntoView();
  }

  renderContent() {
    return (
      <Card>
        <h4>Payment Details</h4>

        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={6}>

              <Card.Text className="donation-summary">
                Donation Amount: <b>{this.props.amount}</b>
              </Card.Text>
      
              <Form.Group controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
              </Form.Group>
      
              <Form.Row>
                <Col>
                  <Form.Group controlId="cardExpMonth">
                    <Form.Label>Expiry</Form.Label>
                    <ExpiryInput
                      field="payment.expiry"
                      monthField="payment.expiryMonth"
                      yearField="payment.expiryYear"
                      testId="expiry-input"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="ccv">
                    <Form.Label>CCV</Form.Label>
                    <CcvInput field="payment.ccv" testId="ccv-input" />
                  </Form.Group>
                </Col>
              </Form.Row>

            </Col>
          </Row>
        </Card.Body>

        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col xs={8} lg={3}>
              <SubmitButton title="Donate" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export const PagePaymentPanel = connectPaymentPanel(_PagePaymentPanel);
