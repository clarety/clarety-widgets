import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Col, Button } from 'react-bootstrap';
import ClaretyApi from '../../shared/services/clarety-api';
import { TextInput, SubmitButton, ErrorMessages } from '../../form/components';
import { statuses, setStatus, setErrors, clearErrors, updateFormData } from '../../form/actions';

class DetailsPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onSubmit = async event => {
    const { history, status, setStatus } = this.props;
    const { formData, updateFormData } = this.props;
    const { clearErrors, setErrors } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();

    const uuid = formData['donation.uuid'];
    const endpoint = uuid ? `donate/${uuid}` : 'donate';
    
    const result = await ClaretyApi.post(endpoint, 'save', formData);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
        updateFormData('donation.uuid', result.donation.uuid);
        updateFormData('jwt', result.jwt);
        history.push('/payment');
      }
    }

    setStatus(statuses.ready);
  };

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
          </Card.Body>
      
          <Card.Footer>
            <Form.Row>
              <Col xs={4}>
                <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
              </Col>
              <Col xs={8}>
                <SubmitButton title="Next" block />
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
  setStatus: setStatus,
  setErrors: setErrors,
  clearErrors: clearErrors,
  updateFormData: updateFormData,
};

export default connect(mapStateToProps, actions)(DetailsPanel);
