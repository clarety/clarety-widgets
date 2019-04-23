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
    const { status, setStatus, clearErrors, setErrors } = this.props;
    const { formData, updateFormData, saleline, history } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();

    const postData = { ...formData, saleline };
    
    const result = await ClaretyApi.post('donations', postData);
    if (result) {
      if (result.validationErrors) {
        setErrors(result.validationErrors);
      } else {
        updateFormData('uid', result.uid);
        updateFormData('jwt', result.jwt);
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
    const { forceMd } = this.props;

    return (
      <Card>
        <Card.Header className="text-center">
          <StepIndicator currentStep="details" />
        </Card.Header>
    
        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={forceMd ? null : 8}>

              <ErrorMessages />
            
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

            </Col>
          </Row>
        </Card.Body>
    
        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col xs={4} lg={forceMd ? null : 2}>
              <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
            </Col>
            <Col xs={8} lg={forceMd ? null : 3}>
              <SubmitButton title="Next" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export default connectDetailsPanel(DetailsPanel);
