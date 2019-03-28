import React from 'react';
import { Card, Form, Col, Button } from 'react-bootstrap';

const DetailsForm = () => (
  <Card>
    <Card.Header className="text-center">
      Personal Details
    </Card.Header>

    <Card.Body>
      <Form>
        <Form.Row>
          <Col>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" />
        </Form.Group>
      </Form>
    </Card.Body>

    <Card.Footer>
      <Form.Row>
        <Col xs={4}>
          <Button variant="secondary" block>Back</Button>
        </Col>
        <Col xs={8}>
          <Button block>Next</Button>
        </Col>
      </Form.Row>
    </Card.Footer>
  </Card>
);

export default DetailsForm;
