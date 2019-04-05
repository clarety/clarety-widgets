import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';

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
  onChange: event => updatePaymentPanelData('ccv', event.target.value),
};

export default connect(mapStateToProps, actions)(CcvInput);
