import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updatePaymentPanelData } from '../../actions';

const CcvInput = ({ ccv, placeholder, testId, updateCcv }) => (
  <Form.Control
    type="tel"
    placeholder={placeholder || '•••'}
    value={ccv || ''}
    onChange={event => updateCcv(event.target.value)}
    data-testid={testId}
    maxLength={4}
  />
);

const mapStateToProps = state => {
  return {
    ccv: state.paymentPanel.ccv,
  };
};

const actions = {
  updateCcv: ccv => updatePaymentPanelData('ccv', ccv),
};

export default connect(mapStateToProps, actions)(CcvInput);
