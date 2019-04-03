import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';

const ExpiryMonthInput = ({ expiryMonth, placeholder, testId, updateExpiryMonth }) => (
  <Form.Control
    type="tel"
    placeholder={placeholder || 'MM'}
    value={expiryMonth || ''}
    onChange={event => updateExpiryMonth(event.target.value)}
    data-testid={testId}
    maxLength={2}
  />
);

const mapStateToProps = state => {
  return {
    expiryMonth: state.paymentPanel.expiryMonth,
  };
};

const actions = {
  updateExpiryMonth: expiryMonth => updatePaymentPanelData('expiryMonth', expiryMonth),
};

export default connect(mapStateToProps, actions)(ExpiryMonthInput);
