import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { PaymentPanel as BasePaymentPanel } from 'shared/components';
import { requiredField } from 'shared/utils';
import { SelectInput } from 'form/components';
import { createStartDateOptions } from 'donate/utils';

export class PaymentPanel extends BasePaymentPanel {
  validateDirectDebitFields(errors) {
    super.validateDirectDebitFields(errors);

    const { formData, startDates } = this.props;

    if (startDates) {
      requiredField(errors, formData, 'additional.startDate');
    }
  }

  getStartDateOptions() {
    return createStartDateOptions(this.props.startDates);
  }
  
  renderCartSummary() {
    return (
      <p className="donation-summary">
        Donation Amount: <b>{this.props.amount}</b>
      </p>
    );
  }

  renderDirectDebitFields() {
    const { startDates } = this.props;

    return (
      <React.Fragment>
        {super.renderDirectDebitFields()}

        {startDates &&
          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <SelectInput
                  field="payment.startDate"
                  options={this.getStartDateOptions()}
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
