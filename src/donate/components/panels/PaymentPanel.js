import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { PaymentPanel as BasePaymentPanel } from 'shared/components';
import { requiredField } from 'shared/utils';
import { SelectInput } from 'form/components';
import { createStartDateOptions } from 'donate/utils';

export class PaymentPanel extends BasePaymentPanel {
  validateCreditCardFields(errors) {
    super.validateCreditCardFields(errors);

    const { formData, frequency } = this.props;
    const paymentMethod = this.getPaymentMethod('gatewaycc');

    if (frequency === 'recurring' && paymentMethod.startDates) {
      requiredField(errors, formData, 'additionalData.startDate');
    }
  }

  validateDirectDebitFields(errors) {
    super.validateDirectDebitFields(errors);

    const { formData, frequency } = this.props;
    const paymentMethod = this.getPaymentMethod('gatewaydd');

    if (frequency === 'recurring' && paymentMethod.startDates) {
      requiredField(errors, formData, 'additionalData.startDate');
    }
  }

  getStartDateOptions(type) {
    const paymentMethod = this.getPaymentMethod(type);
    return createStartDateOptions(paymentMethod.startDates);
  }

  getPaymentData() {
    const { formData, frequency } = this.props;

    const paymentData = super.getPaymentData();
    const paymentMethod = this.getPaymentMethod(formData['payment.type']);

    if (frequency === 'recurring' && paymentMethod.startDates) {
      paymentData.startDate = formData['additionalData.startDate'];
    }
    
    return paymentData;
  }
  
  renderCartSummary() {
    const { frequency, amount } = this.props;

    const label = frequency === 'recurring'
      ? 'Monthly Donation Amount:'
      : 'Donation Amount:';

    return (
      <p className="donation-summary">
        {label} <b>{amount}</b>
      </p>
    );
  }

  renderCreditCardFields() {
    const { frequency, settings } = this.props;
    const showStartState = !settings.hideStartDate && frequency === 'recurring';

    return (
      <React.Fragment>
        {super.renderCreditCardFields()}
        {showStartState && this.renderStartDateInput('gatewaycc')}
      </React.Fragment>
    );
  }

  renderDirectDebitFields() {
    const { frequency, settings } = this.props;
    const showStartState = !settings.hideStartDate && frequency === 'recurring';

    return (
      <React.Fragment>
        {super.renderDirectDebitFields()}
        {showStartState && this.renderStartDateInput('gatewaydd')}
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
              field="additionalData.startDate"
              options={this.getStartDateOptions(methodType)}
              testId="start-date-input"
            />
          </Form.Group>
        </Col>
      </Row>
    );
  }
}
