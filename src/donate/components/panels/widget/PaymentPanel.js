import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { scrollIntoView } from 'shared/utils';
import { SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput } from 'form/components';
import { BasePanel, StepIndicator } from 'donate/components';
import { connectPaymentPanel } from 'donate/utils';
import 'react-block-ui/style.css';

export class _PaymentPanel extends BasePanel {
  componentDidMount() {
    scrollIntoView(this);
  }

  onPrev = () => this.props.history.goBack();

  onSubmit = event => {
    event.preventDefault();
    this.props.submitPaymentPanel();
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} data-testid="payment-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { forceMd, isBusy } = this.props;

    return (
      <Card>
        <Card.Header className="text-center">
          <StepIndicator currentStep="payment" />
        </Card.Header>
  
        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={forceMd ? null : 8}>

              <ErrorMessages />

              <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>

                <Card.Text className="text-center">
                  Donation Amount: <b>{this.props.amount}</b>
                </Card.Text>
        
                <Form.Group controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
                </Form.Group>
        
                <Form.Row>
                  <Col>
                    <Form.Group controlId="cardExpMonth">
                      <Form.Label>Expiry</Form.Label>
                      <ExpiryInput
                        field="payment.expiry"
                        monthField="payment.expiryMonth"
                        yearField="payment.expiryYear"
                        testId="expiry-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="ccv">
                      <Form.Label>CCV</Form.Label>
                      <CcvInput field="payment.ccv" testId="ccv-input" />
                    </Form.Group>
                  </Col>
                </Form.Row>

              </BlockUi>

            </Col>
          </Row>
        </Card.Body>
  
        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col xs={4} lg={forceMd ? null : 2}>
              <BackButton title="Back" onClick={this.onPrev} block />
            </Col>
            <Col xs={8} lg={forceMd ? null : 3}>
              <SubmitButton title="Donate" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }
}

export const PaymentPanel = connectPaymentPanel(_PaymentPanel);
