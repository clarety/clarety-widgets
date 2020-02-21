import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { PaymentPanel as BasePaymentPanel } from 'shared/components';
import { requiredField } from 'shared/utils';
import { SelectInput } from 'form/components';
import { createStartDateOptions } from 'donate/utils';

export class PaymentPanel extends BasePaymentPanel {
  validateDirectDebitFields(errors) {
    super.validateDirectDebitFields(errors);

    const { formData } = this.props;
    const directDebitMethod = this.getPaymentMethod('gatewaydd');

    if (directDebitMethod.startDates) {
      requiredField(errors, formData, 'payment.startDate');
    }
  }

  getStartDateOptions(type) {
    const paymentMethod = this.getPaymentMethod(type);
    return createStartDateOptions(paymentMethod.startDates);
  }

  getPaymentData() {
    const paymentData = super.getPaymentData();

    const { formData } = this.props;
    const paymentMethod = formData['payment.type'];

    if (paymentMethod === 'gatewaydd') {
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

  renderDirectDebitFields() {
    const directDebitMethod = this.getPaymentMethod('gatewaydd');

    return (
      <React.Fragment>
        {super.renderDirectDebitFields()}

        {directDebitMethod.startDates &&
          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <SelectInput
                  field="payment.startDate"
                  options={this.getStartDateOptions('gatewaydd')}
                  testId="start-date-input"
                />
              </Form.Group>
            </Col>
          </Row>
        }
      </React.Fragment>
    );
  }
}
