import React from 'react';
import { Card, Form, Col, Button } from 'react-bootstrap';

const PaymentPanel = () => (
  <Card>
    <Card.Header className="text-center">
      Payment Details
    </Card.Header>

    <Card.Body>
      <Form.Group controlId="cardNumber">
        <Form.Label>Card Number</Form.Label>
        <Form.Control type="tel" />
      </Form.Group>

      <Form.Row>
        <Col>
          <Form.Group controlId="cardExpMonth">
            <Form.Label>Expiry Month</Form.Label>
            <Form.Control type="tel" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="cardExpYear">
            <Form.Label>Expiry Year</Form.Label>
            <Form.Control type="tel" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="ccv">
            <Form.Label>CCV</Form.Label>
            <Form.Control type="tel" />
          </Form.Group>
        </Col>
      </Form.Row>
    </Card.Body>

    <Card.Footer>
      <Form.Row>
        <Col xs={4}>
          <Button variant="secondary" block>Back</Button>
        </Col>
        <Col xs={8}>
          <Button block>Donate</Button>
        </Col>
      </Form.Row>
    </Card.Footer>
  </Card>
);

export default PaymentPanel;
