import React from 'react';
import { connect } from 'react-redux';
import { Form, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from 'form/utils';

const _VariableAmount = ({ amountInfo, value, isSelected, onChange, currency, forceMd, onMouseEnter, onMouseLeave }) => {
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
          ref={input}
          value={value}
          type="text"
          onFocus={event => onChange(event.target.value)}
          onChange={event => onChange(cleanDecimal(event.target.value))}
          onMouseEnter={() => onMouseEnter(amountInfo)}
          onMouseLeave={() => onMouseLeave(amountInfo)}
          data-testid="variable-amount-input"
        />
      </InputGroup>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.settings.currency,
  }
};

export const connectVariableAmount = connect(mapStateToProps);
export const VariableAmount = connectVariableAmount(_VariableAmount);
