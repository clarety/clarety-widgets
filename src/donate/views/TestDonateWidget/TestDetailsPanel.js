import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Col, Button } from 'react-bootstrap';
import { DetailsPanel } from '../DonateWidget/DetailsPanel';
import { TextInput, SubmitButton, ErrorMessages } from '../../../form/components';
import * as sharedActions from '../../../shared/actions';
import * as formActions from '../../../form/actions';
import * as donateActions from '../../actions';

class TestDetailsPanel extends DetailsPanel {
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Card>
          <Card.Header className="text-center">
            Personal Details
          </Card.Header>
      
          <Card.Body>
            <ErrorMessages />

            <Form.Row>
              <Col>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <TextInput property="customer.firstName" testId="first-name" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <TextInput property="customer.lastName" testId="last-name" />
                </Form.Group>
              </Col>
            </Form.Row>
    
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <TextInput property="customer.email" type="email" testId="email" />
            </Form.Group>
          </Card.Body>
      
          <Card.Footer>
            <Form.Row>
              <Col xs={4}>
                <Button variant="secondary" onClick={this.onPrev} block data-testid="back-btn">Back</Button>
              </Col>
              <Col xs={8}>
                <SubmitButton title="Next" block testId="next-btn" />
              </Col>
            </Form.Row>
          </Card.Footer>
        </Card>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
    formData: state.formData,
  };
};

const actions = {
  setStatus: sharedActions.setStatus,
  setErrors: formActions.setErrors,
  clearErrors: formActions.clearErrors,
  updateFormData: formActions.updateFormData,
  setDonation: donateActions.setDonation,
};

export default connect(mapStateToProps, actions)(TestDetailsPanel);
