import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput } from 'checkout/components';
import { setPaymentDetails, createSale, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PaymentDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      this.props.setPaymentDetails(this.state.formData);
      this.props.createSale();
    }
  };

  validate() {
    // TODO: validate fields...
    return true;
  }

  renderWait() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>5. Payment Details</h2>
        <hr />
      </div>
    );
  }

  renderEdit() {
    return (
      <div>
        <h2>5. Payment Details</h2>
        <hr />

        <FormContext.Provider value={this.state}>
          <Form>
            <Form.Row>
              <Col>
                <TextInput field="cardNumber" placeholder="Card Number *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="cardName" placeholder="Name On Card *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col xs={8}>Expiry Date *</Col>
              <Col>CCV *</Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="expiryMonth" placeholder="MM" />
              </Col>
              <Col>
                <TextInput field="expiryYear" placeholder="YYYY" />
              </Col>
              <Col>
                <TextInput field="ccv" placeholder="CCV" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                By clicking the <strong>Pay Now</strong> button, you’re acknowledging that you’ve read and accept the <a href="#">Terms &amp; Conditions</a>.
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Pay Now</Button>
      </div>
    );
  }

  renderDone() {
    const { cardNumber } = this.props.paymentDetails;

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>5.</h2> {cardNumber} <Button onClick={this.onPressEdit}>Edit</Button>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    paymentDetails: state.data.paymentDetails,
  };
};

const actions = {
  setPaymentDetails: setPaymentDetails,
  createSale: createSale,
  editPanel: editPanel,
};

export const PaymentDetailsPanel = connect(mapStateToProps, actions)(_PaymentDetailsPanel);
