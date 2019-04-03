import React from 'react';
import { Card, Form, Col, Button } from 'react-bootstrap';
import TextInput from '../../form/components/TextInput';

class DetailsPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onNext = () => this.props.history.push('/payment');

  render() {
    return (
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
                  <TextInput property="customer.firstName" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <TextInput property="customer.lastName" />
                </Form.Group>
              </Col>
            </Form.Row>
    
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <TextInput property="customer.email" type="email" />
            </Form.Group>
          </Form>
        </Card.Body>
    
        <Card.Footer>
          <Form.Row>
            <Col xs={4}>
              <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
            </Col>
            <Col xs={8}>
              <Button onClick={this.onNext} block>Next</Button>
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export default DetailsPanel;
