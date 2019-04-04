import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Col, Button } from 'react-bootstrap';
import { SubmitButton } from '../../form/components';
import { CardNumberInput, ExpiryMonthInput, ExpiryYearInput, CcvInput } from '../components';

class PaymentPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onSubmit = event => {
    event.preventDefault();

    const { paymentDetails } = this.props;
    console.log(paymentDetails);

    // this.props.history.push('/success');
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Card>
          <Card.Header className="text-center">
            Payment Details
          </Card.Header>

          <Card.Body>
            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <CardNumberInput />
            </Form.Group>

            <Form.Row>
              <Col>
                <Form.Group controlId="cardExpMonth">
                  <Form.Label>Expiry Month</Form.Label>
                  <ExpiryMonthInput />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="cardExpYear">
                  <Form.Label>Expiry Year</Form.Label>
                  <ExpiryYearInput />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="ccv">
                  <Form.Label>CCV</Form.Label>
                  <CcvInput />
                </Form.Group>
              </Col>
            </Form.Row>
          </Card.Body>

          <Card.Footer>
            <Form.Row>
              <Col xs={4}>
                <Button variant="secondary" onClick={this.onPrev} block>Back</Button>
              </Col>
              <Col xs={8}>
                <SubmitButton title="Donate" block />
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
    paymentDetails: state.paymentPanel,
  };
};

export default connect(mapStateToProps)(PaymentPanel);
