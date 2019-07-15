import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from 'form/actions';
import { getValidationError, getCardType, formatCardNumber, cleanCardNumber } from 'form/utils';
import { FieldError } from 'form/components';
import './CardNumberInput.css';

const _CardNumberInput = ({ cardNumber, placeholder, testId, onChange, error }) => (
  <React.Fragment>
    <Form.Control
      type="text"
      className={'card-number ' + getCardType(cardNumber)}
      placeholder={placeholder || '•••• •••• •••• ••••'}
      value={cardNumber}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </React.Fragment>
);

const mapStateToProps = state => {
  return {
    cardNumber: formatCardNumber(state.paymentData.cardNumber),
    error: getValidationError('cardNumber', state.errors),
  };
};

const actions = {
  onChange: event => updatePaymentData('cardNumber', cleanCardNumber(event.target.value)),
};

export const CardNumberInput = connect(mapStateToProps, actions)(_CardNumberInput);
