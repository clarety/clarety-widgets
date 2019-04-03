import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Col, Button } from 'react-bootstrap';
import ClaretyApi from '../../shared/services/clarety-api';
import TextInput from '../../form/components/TextInput';
import SubmitButton from '../../form/components/SubmitButton';
import ErrorMessages from '../../form/components/ErrorMessages';
import { statuses, setStatus, setErrors, clearErrors } from '../../form/actions';

class DetailsPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onSubmit = async event => {
    const { status, setStatus, formData } = this.props;
    const { history, clearErrors, setErrors } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();
    
    const result = await ClaretyApi.post('donate', 'donate', formData);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
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
};

export default connect(mapStateToProps, actions)(DetailsPanel);
