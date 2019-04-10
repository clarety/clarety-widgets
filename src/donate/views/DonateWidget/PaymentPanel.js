import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Col, Button } from 'react-bootstrap';
import ClaretyApi from '../../../shared/services/clarety-api';
import { statuses } from '../../../shared/actions';
import { SubmitButton, ErrorMessages } from '../../../form/components';
import { CardNumberInput, ExpiryInput, CcvInput } from '../../../form/components';
import { createStripeToken, parseStripeError, validateCard } from '../../utils/stripe-utils';
import * as sharedActions from '../../../shared/actions';
import * as formActions from '../../../form/actions';
import * as donateActions from '../../actions';

class PaymentPanel extends React.Component {
  onPrev = () => this.props.history.goBack();

  onSubmit = event => {
    const { status, cardDetails, setStatus, setErrors, clearErrors } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    clearErrors();

    const errors = validateCard(cardDetails);
    if (errors) {
      setErrors(errors);
      setStatus(statuses.ready);
    } else {
      this.onValidate(cardDetails);
    }
  };

  onValidate = async cardDetails => {
    const { payment, stripeKey, setStatus, setErrors, setPayment } = this.props;

    if (payment.stripeToken) {
      this.attemptPayment();
    } else {
      const result = await createStripeToken(cardDetails, stripeKey);

      if (result.error) {
        const errors = parseStripeError(result.error);
        setErrors(errors);
        setStatus(statuses.ready);
      } else {
        setPayment({ stripeToken: result.id });
        this.attemptPayment();
      }
    }
  };

  attemptPayment = async () => {
    const { formData, saleLines, payment, jwt } = this.props;
    const { setStatus, setErrors, setDonation, history } = this.props;

    const uuid = formData['donation.uuid'];
    const endpoint = uuid ? `donate/${uuid}` : 'donate';

    const postData = { ...formData, saleLines, payment };

    const result = await ClaretyApi.post(endpoint, postData, jwt);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
        setDonation(result.donation);
        history.push('/success');
      }
    }

    setStatus(statuses.ready);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Card>
          <Card.Header className="text-center">
            Payment Details
          </Card.Header>

          <Card.Body>
            <ErrorMessages />

            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <CardNumberInput />
            </Form.Group>

            <Form.Row>
              <Col>
                <Form.Group controlId="cardExpMonth">
                  <Form.Label>Expiry</Form.Label>
                  <ExpiryInput />
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
    status: state.status,

    stripeKey: state.explain.stripePublishableKey,
    cardDetails: state.panels.paymentPanel,

    jwt: state.jwt,
    formData: state.formData,
    saleLines: state.sale.saleLines,
    payment: state.sale.payment,
  };
};

const actions = {
  setStatus: sharedActions.setStatus,

  setErrors: formActions.setErrors,
  clearErrors: formActions.clearErrors,

  setPayment: sharedActions.setPayment,
  setDonation: donateActions.setDonation,
};

export default connect(mapStateToProps, actions)(PaymentPanel);
