import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { cleanDecimal } from '../../../form/utils/payment-utils';

const VariableAmount = ({ value, amountInfo, isSelected, onChange, currency, forceMd }) => {
  let input = React.createRef();

  let className = 'mt-3 mb-1 mx-3';
  if (!forceMd) className += ' d-lg-none';

  return (
    <div className={className}>
      <Form.Control
        placeholder="Other Amount"
        required={isSelected}
        ref={input}
        value={value}
        type="text"
        onFocus={event => onChange(event.target.value)}
        onChange={event => onChange(cleanDecimal(event.target.value))}
        data-testid="variable-amount-input"
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.explain.currency,
  }
};

export default connect(mapStateToProps)(VariableAmount);
