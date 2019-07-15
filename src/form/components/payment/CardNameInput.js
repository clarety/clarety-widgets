import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../actions';
import { getValidationError } from '../../utils';
import { FieldError } from '..';

const _CardNameInput = ({ cardName, placeholder, testId, onChange, error }) => (
  <React.Fragment>
    <Form.Control
      type="text"
      placeholder={placeholder}
      value={cardName}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </React.Fragment>
);

const mapStateToProps = state => {
  return {
    cardName: state.paymentData.cardName || '',
    error: getValidationError('cardName', state.errors),
  };
};

const actions = {
  onChange: event => updatePaymentData('cardName', event.target.value),
};

export const CardNameInput = connect(mapStateToProps, actions)(_CardNameInput);
