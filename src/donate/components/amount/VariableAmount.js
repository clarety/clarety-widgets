import React from 'react';
import { connect } from 'react-redux';
import { Form, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from '../../../form/utils/payment-utils';

const _VariableAmount = ({ value, amountInfo, isSelected, onChange, currency, forceMd }) => {
  let input = React.createRef();

  let className = 'mt-3 mb-1 mx-3';
  if (!forceMd) className += ' d-lg-none';

  return (
    <div className={className}>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{currency.symbol}</InputGroup.Text>
        </InputGroup.Prepend>
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
      </InputGroup>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.explain.currency,
  }
};

export const VariableAmount = connect(mapStateToProps)(_VariableAmount);
