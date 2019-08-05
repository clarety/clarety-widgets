import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, CardNumberInput, CcvInput, Button } from 'checkout/components';
import { makePayment, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _PaymentDetailsPanel extends BasePanel {
  onPressPayNow = () => {
    if (this.validate()) {
      this.props.makePayment(this.state.formData);
    }
  };

  validate() {
    // TODO: validate fields...
    return true;
  }

  componentDidUpdate(prevProps) {
    const { errors } = this.props;
    if (prevProps.errors !== errors) {
      this.setState({ errors });
    }
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
                <CardNumberInput field="cardNumber" placeholder="Card Number *" />
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
                <CcvInput field="ccv" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                By clicking the <strong>Pay Now</strong> button, you’re acknowledging that you’ve read and accept the <a href="#">Terms &amp; Conditions</a>.
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button
          title="Pay Now"
          onClick={this.onPressPayNow}
          isBusy={this.props.isBusy}
        />
      </div>
    );
  }

  renderDone() {
    const cardNumber = this.state.formData['cardNumber'];

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
    isBusy: state.cart.isBusy,
    errors: state.cart.errors,
  };
};

const actions = {
  makePayment: makePayment,
  editPanel: editPanel,
};

export const PaymentDetailsPanel = connect(mapStateToProps, actions)(_PaymentDetailsPanel);
