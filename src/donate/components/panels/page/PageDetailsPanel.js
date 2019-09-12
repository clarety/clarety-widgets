import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { TextInput, FormElement } from 'form/components';
import { _DetailsPanel } from 'donate/components';
import { connectDetailsPanel } from 'donate/utils';

export class _PageDetailsPanel extends _DetailsPanel {
  componentDidMount() {
  }

  renderContent() {
    return (
      <Card>
        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={6}>
            
              <Form.Row>
                <Col sm>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <TextInput field="customer.firstName" testId="first-name-input" />
                  </Form.Group>
                </Col>
                <Col sm>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <TextInput field="customer.lastName" testId="last-name-input" />
                  </Form.Group>
                </Col>
              </Form.Row>
      
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <TextInput field="customer.email" type="email" testId="email-input" />
              </Form.Group>

              <Form.Row>
                <Col sm>
                  <Form.Group controlId="street">
                    <Form.Label>Street</Form.Label>
                    <TextInput field="customer.billing.address1" type="street" testId="street-input" />
                  </Form.Group>
                </Col>
                <Col sm>
                  <Form.Group controlId="suburb">
                    <Form.Label>Suburb</Form.Label>
                    <TextInput field="customer.billing.suburb" testId="suburb-input" />
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col sm>
                  <Form.Group controlId="state">
                    <Form.Label>State</Form.Label>
                    <TextInput field="customer.billing.state" testId="state-input" />
                  </Form.Group>
                </Col>
                <Col sm>
                  <Form.Group controlId="postcode">
                    <Form.Label>Postcode</Form.Label>
                    <TextInput field="customer.billing.postcode" testId="postcode-input" />
                  </Form.Group>
                </Col>
              </Form.Row>

              <FormElement field="customer.billing.country" value="AU" />

            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export const PageDetailsPanel = connectDetailsPanel(_PageDetailsPanel);
