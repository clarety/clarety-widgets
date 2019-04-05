import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../../form/actions';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';

const ExpiryMonthInput = ({ expiryMonth, placeholder, testId, onChange, error }) => (
  <>
    <Form.Control
      type="tel"
      placeholder={placeholder || 'MM'}
      value={expiryMonth}
      onChange={onChange}
      data-testid={testId}
      maxLength={2}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </>
);

const mapStateToProps = state => {
  return {
    expiryMonth: state.paymentPanel.expiryMonth,
    error: getValidationError('expiryMonth', state.errors),
  };
};

const actions = {
  onChange: event => updatePaymentData('expiryMonth', event.target.value),
};

export default connect(mapStateToProps, actions)(ExpiryMonthInput);
