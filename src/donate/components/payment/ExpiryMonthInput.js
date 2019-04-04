import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';

const ExpiryMonthInput = ({ expiryMonth, placeholder, testId, updateExpiryMonth, error }) => (
  <>
    <Form.Control
      type="tel"
      placeholder={placeholder || 'MM'}
      value={expiryMonth}
      onChange={event => updateExpiryMonth(event.target.value)}
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
  updateExpiryMonth: expiryMonth => updatePaymentPanelData('expiryMonth', expiryMonth),
};

export default connect(mapStateToProps, actions)(ExpiryMonthInput);
