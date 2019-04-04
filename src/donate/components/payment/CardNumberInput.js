import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';
import { getCardType, formatCardNumber, cleanCardNumber } from '../../utils/payment-utils';
import { getValidationError } from '../../../form/utils/form-utils';
import { FieldError } from '../../../form/components';
import './CardNumberInput.css';

const CardNumberInput = ({ cardNumber, placeholder, testId, updateCardNumber, error }) => (
  <>
    <Form.Control
      type="tel"
      className={'card-number ' + getCardType(cardNumber)}
      placeholder={placeholder || '•••• •••• •••• ••••'}
      value={cardNumber}
      onChange={event => updateCardNumber(event.target.value)}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </>
);

const mapStateToProps = state => {
  return {
    cardNumber: formatCardNumber(state.paymentPanel.cardNumber),
    error: getValidationError('cardNumber', state.errors),
  };
};

const actions = {
  updateCardNumber: cardNumber => updatePaymentPanelData('cardNumber', cleanCardNumber(cardNumber)),
};

export default connect(mapStateToProps, actions)(CardNumberInput);
