import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../actions';
import { getValidationError, cleanCcv } from '../../utils';
import { FieldError } from '..';
import './CcvInput.css';

const _CcvInput = ({ ccv, placeholder, testId, onChange, error }) => (
  <React.Fragment>
    <Form.Control
      type="text"
      placeholder={placeholder || '•••'}
      value={ccv}
      onChange={onChange}
      data-testid={testId}
      maxLength={4}
      isInvalid={error !== null}
      className="ccv-input"
    />
    <FieldError error={error} />
  </React.Fragment>
);

const mapStateToProps = state => {
  return {
    ccv: state.paymentData.ccv,
    error: getValidationError('ccv', state.errors),
  };
};

const actions = {
  onChange: event => updatePaymentData('ccv', cleanCcv(event.target.value)),
};

export const CcvInput = connect(mapStateToProps, actions)(_CcvInput);
