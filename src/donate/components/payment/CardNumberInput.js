import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';
import { getCardType, formatCardNumber, cleanCardNumber } from '../../utils/payment-utils';
import './CardNumberInput.css';

const CardNumberInput = ({ cardNumber, placeholder, testId, updateCardNumber }) => (
  <Form.Control
    type="tel"
    className={'card-number ' + getCardType(cardNumber)}
    placeholder={placeholder || '•••• •••• •••• ••••'}
    value={formatCardNumber(cardNumber || '')}
    onChange={event => updateCardNumber(event.target.value)}
    data-testid={testId}
  />
);

const mapStateToProps = state => {
  return {
    cardNumber: state.paymentPanel.cardNumber,
  };
};

const actions = {
  updateCardNumber: cardNumber => updatePaymentPanelData('cardNumber', cleanCardNumber(cardNumber)),
};

export default connect(mapStateToProps, actions)(CardNumberInput);
