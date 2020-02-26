import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { PaymentPanel as BasePaymentPanel } from 'shared/components';
import { requiredField } from 'shared/utils';
import { SelectInput } from 'form/components';
import { createStartDateOptions } from 'donate/utils';

export class PaymentPanel extends BasePaymentPanel {
  validateCreditCardFields(errors) {
    super.validateCreditCardFields(errors);

    const { formData } = this.props;
    const paymentMethod = this.getPaymentMethod('gatewaycc');

    if (paymentMethod.startDates) {
      requiredField(errors, formData, 'payment.startDate');
    }
  }

  validateDirectDebitFields(errors) {
    super.validateDirectDebitFields(errors);

    const { formData } = this.props;
    const paymentMethod = this.getPaymentMethod('gatewaydd');

    if (paymentMethod.startDates) {
      requiredField(errors, formData, 'payment.startDate');
    }
  }

  getStartDateOptions(type) {
    const paymentMethod = this.getPaymentMethod(type);
    return createStartDateOptions(paymentMethod.startDates);
  }

  getPaymentData() {
    const { formData } = this.props;

    const paymentData = super.getPaymentData();
    const paymentMethod = this.getPaymentMethod(formData['payment.type']);

    if (paymentMethod.startDates) {
      paymentData.startDate = formData['payment.startDate'];
    }
    
    return paymentData;
  }
  
  renderCartSummary() {
    return (
      <p className="donation-summary">
        Donation Amount: <b>{this.props.amount}</b>
      </p>
    );
  }

  renderCreditCardFields() {
    return (
      <React.Fragment>
        {super.renderCreditCardFields()}
        {this.renderStartDateInput('gatewaycc')}
      </React.Fragment>
    );
  }

  renderDirectDebitFields() {
    return (
      <React.Fragment>
        {super.renderDirectDebitFields()}
        {this.renderStartDateInput('gatewaydd')}
      </React.Fragment>
    );
  }

  renderStartDateInput(methodType) {
    const paymentMethod = this.getPaymentMethod(methodType);
    if (!paymentMethod || !paymentMethod.startDates) return null;

    return (
      <Row>
        <Col>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <SelectInput
              field="payment.startDate"
              options={this.getStartDateOptions(methodType)}
              testId="start-date-input"
            />
          </Form.Group>
        </Col>
      </Row>
    );
  }
}
