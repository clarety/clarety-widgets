import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../shared/actions';
import { TextInput, SubmitButton, ErrorMessages } from '../../form/components';
import { StepIndicator } from '../components';
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

    const postData = { ...formData, saleLines, jwt };
    
    const result = await ClaretyApi.post(endpoint, postData);
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
      <div className="container my-4">
        <Card>
          <Card.Header className="text-center">
            <StepIndicator currentStep="details" />
          </Card.Header>
      
          <Card.Body>
            <Row className="justify-content-center">
              <Col md={6}>

                <ErrorMessages />
              
                <Form.Row>
                  <Col sm>
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <TextInput property="customer.firstName" testId="first-name-input" />
                    </Form.Group>
                  </Col>
                  <Col sm>
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

              </Col>
            </Row>
          </Card.Body>
      
          <Card.Footer>
            <Form.Row className="justify-content-md-center">
              <Col xs={4} md={2}>
                <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
              </Col>
              <Col xs={8} md={3}>
                <SubmitButton title="Next" block testId="next-button" />
              </Col>
            </Form.Row>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}

export default connectDetailsPanel(DetailsPanel);
