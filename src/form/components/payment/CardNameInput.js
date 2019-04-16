import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../../form/actions';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';

const CardNameInput = ({ cardName, placeholder, testId, onChange, error }) => (
  <>
    <Form.Control
      type="text"
      placeholder={placeholder}
      value={cardName}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </>
);

const mapStateToProps = state => {
  return {
    cardName: state.panels.paymentPanel.cardName || '',
    error: getValidationError('cardName', state.errors),
  };
};

const actions = {
  onChange: event => updatePaymentData('cardName', event.target.value),
};

export default connect(mapStateToProps, actions)(CardNameInput);
