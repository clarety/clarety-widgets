import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';

const ExpiryYearInput = ({ expiryYear, placeholder, testId, updateExpiryYear, error }) => (
  <>
    <Form.Control
      type="tel"
      placeholder={placeholder || 'YY'}
      value={expiryYear}
      onChange={event => updateExpiryYear(event.target.value)}
      data-testid={testId}
      maxLength={2}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </>
);

const mapStateToProps = state => {
  return {
    expiryYear: state.paymentPanel.expiryYear,
    error: getValidationError('expiryYear', state.errors),
  };
};

const actions = {
  updateExpiryYear: expiryYear => updatePaymentPanelData('expiryYear', expiryYear),
};

export default connect(mapStateToProps, actions)(ExpiryYearInput);
