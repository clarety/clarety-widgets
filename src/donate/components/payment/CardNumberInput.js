import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';

const CardNumberInput = ({ cardNumber, placeholder, testId, updateCardNumber }) => (
  <Form.Control
    type="tel"
    placeholder={placeholder || '•••• •••• •••• ••••'}
    value={formatCardNumber(cardNumber || '')}
    onChange={event => updateCardNumber(event.target.value)}
    data-testid={testId}
  />
);

// Split numbers into groups of 4.
const formatCardNumber = number => {
  const groups = [];

  for (let i = 0; i < number.length; i += 4) {
    const group = number.substring(i, i + 4);
    groups.push(group);
  }

  return groups.join(' ');
}

// Remove anything that isn't a number.
const cleanCardNumber = number => {
  return number.replace(/[^0-9]/g, '');
};

const mapStateToProps = state => {
  return {
    cardNumber: state.paymentPanel.cardNumber,
  };
};

const actions = {
  updateCardNumber: cardNumber => updatePaymentPanelData('cardNumber', cleanCardNumber(cardNumber)),
};

export default connect(mapStateToProps, actions)(CardNumberInput);
