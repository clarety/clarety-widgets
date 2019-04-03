import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';

const CardNumberInput = ({ cardNumber, placeholder, testId, updateCardNumber }) => (
  <Form.Control
    type="tel"
    placeholder={placeholder || '•••• •••• •••• ••••'}
    value={cardNumber || ''}
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
  updateCardNumber: cardNumber => updatePaymentPanelData('cardNumber', cardNumber),
};

export default connect(mapStateToProps, actions)(CardNumberInput);
