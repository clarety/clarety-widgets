import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentData } from '../../../form/actions';
import { getCardType, formatCardNumber, cleanCardNumber } from '../../utils/payment-utils';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';
import './CardNumberInput.css';

const CardNumberInput = ({ cardNumber, placeholder, testId, onChange, error }) => (
  <>
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
  </>
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

export default connect(mapStateToProps, actions)(CardNumberInput);
