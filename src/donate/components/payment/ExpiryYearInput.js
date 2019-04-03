import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';

const ExpiryYearInput = ({ expiryYear, placeholder, testId, updateExpiryYear }) => (
  <Form.Control
    type="tel"
    placeholder={placeholder || 'YY'}
    value={expiryYear || ''}
    onChange={event => updateExpiryYear(event.target.value)}
    data-testid={testId}
    maxLength={2}
  />
);

const mapStateToProps = state => {
  return {
    expiryYear: state.paymentPanel.expiryYear,
  };
};

const actions = {
  updateExpiryYear: expiryYear => updatePaymentPanelData('expiryYear', expiryYear),
};

export default connect(mapStateToProps, actions)(ExpiryYearInput);
