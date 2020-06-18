import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { _PaymentPanel as BasePaymentPanel, injectStripe } from 'shared/components';
import { SelectInput } from 'form/components';
import { Currency } from 'shared/components';
import { requiredField } from 'shared/utils';
import { createStartDateOptions } from 'donate/utils';

export class _PaymentPanel extends BasePaymentPanel {
  shouldShowStartDate(paymentMethod) {
    const { frequency, settings } = this.props;

    if (frequency !== 'recurring') return false;
    if (!paymentMethod.startDates) return false;
    if (settings.hideStartDate)    return false;

    return true;
  }

  validateFields(paymentMethod, errors) {
    super.validateFields(paymentMethod, errors);

    if (this.shouldShowStartDate(paymentMethod)) {
      requiredField(errors, this.props.formData, 'additionalData.startDate');
    }
  }

  getStartDateOptions(paymentMethod) {
    return createStartDateOptions(paymentMethod.startDates);
  }

  getPaymentData() {
    const { formData, frequency } = this.props;

    const paymentData = super.getPaymentData();

    if (frequency === 'recurring') {
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
        {label} <b><Currency amount={amount} /></b>
      </p>
    );
  }

  renderPaymentFields(paymentMethod) {
    return (
      <React.Fragment>
        {super.renderPaymentFields(paymentMethod)}
        {this.renderStartDateInput(paymentMethod)}
      </React.Fragment>
    );
  }

  renderStartDateInput(paymentMethod) {
    if (!this.shouldShowStartDate(paymentMethod)) return null;

    return (
      <Row>
        <Col>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <SelectInput
              field="additionalData.startDate"
              options={this.getStartDateOptions(paymentMethod)}
              testId="start-date-input"
            />
          </Form.Group>
        </Col>
      </Row>
    );
  }
}

export const PaymentPanel = injectStripe(_PaymentPanel);
