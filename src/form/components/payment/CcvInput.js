import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../../form/actions';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';
import './CcvInput.css';

const CcvInput = ({ ccv, placeholder, testId, onChange, error }) => (
  <>
    <Form.Control
      type="tel"
      placeholder={placeholder || '•••'}
      value={ccv}
      onChange={onChange}
      data-testid={testId}
      maxLength={4}
      isInvalid={error !== null}
      className="ccv-input"
    />
    <FieldError error={error} />
  </>
);

const mapStateToProps = state => {
  return {
    ccv: state.paymentPanel.ccv,
    error: getValidationError('ccv', state.errors),
  };
};

const actions = {
  onChange: event => updatePaymentData('ccv', event.target.value),
};

export default connect(mapStateToProps, actions)(CcvInput);
