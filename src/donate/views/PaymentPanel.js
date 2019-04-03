import React from 'react';
import { Card, Form, Col, Button } from 'react-bootstrap';
import { TextInput } from '../../form/components';

class PaymentPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onNext = () => this.props.history.push('/success');

  render() {
    return (
      <Card>
        <Card.Header className="text-center">
          Payment Details
        </Card.Header>

        <Card.Body>
          <Form.Group controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <TextInput property="payment.cardNumber" />
          </Form.Group>

          <Form.Row>
            <Col>
              <Form.Group controlId="cardExpMonth">
                <Form.Label>Expiry Month</Form.Label>
                <TextInput property="payment.cardExpMonth" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="cardExpYear">
                <Form.Label>Expiry Year</Form.Label>
                <TextInput property="payment.cardExpYear" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="ccv">
                <Form.Label>CCV</Form.Label>
                <TextInput property="payment.ccv" />
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
              <Button onClick={this.onNext} block>Donate</Button>
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export default PaymentPanel;
