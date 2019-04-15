import React from 'react';
import { Card, Form, Col, Button } from 'react-bootstrap';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../shared/actions';
import { TextInput, SubmitButton, ErrorMessages } from '../../form/components';
import { connectDetailsPanel } from '../utils/donate-utils';

export class DetailsPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onSubmit = async event => {
    const { status, setStatus } = this.props;
    const { formData, saleLines, jwt, donation } = this.props;
    const { clearErrors, setErrors } = this.props;
    const { history, setDonation, setJwt } = this.props

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();

    const endpoint = donation ? `donations/${donation.uuid}` : 'donations';

    const postData = { ...formData, saleLines };
    
    const result = await ClaretyApi.post(endpoint, postData, jwt);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
        setJwt(result.jwt);
        setDonation(result.donation);
        history.push('/payment');
      }
    }

    setStatus(statuses.ready);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} data-testid="details-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    return (
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
                <TextInput property="customer.firstName" testId="first-name-input" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <TextInput property="customer.lastName" testId="last-name-input" />
              </Form.Group>
            </Col>
          </Form.Row>
  
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <TextInput property="customer.email" type="email" testId="email-input" />
          </Form.Group>
        </Card.Body>
    
        <Card.Footer>
          <Form.Row>
            <Col xs={4}>
              <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
            </Col>
            <Col xs={8}>
              <SubmitButton title="Next" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export default connectDetailsPanel(DetailsPanel);
