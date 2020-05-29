import React from 'react';
import { connect } from 'react-redux';
import { Form, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from 'form/utils';

const _VariableAmount = ({ amountInfo, value, placeholder, isSelected, onChange, currency, onMouseEnter, onMouseLeave }) => (
  <div className={`variable-amount ${isSelected ? 'variable-amount--selected' : ''}`}>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>{currency.code} {currency.symbol}</InputGroup.Text>
      </InputGroup.Prepend>

      <Form.Control
        value={value}
        placeholder={placeholder || 'Other Amount'}
        type="tel"
        onFocus={event => onChange(event.target.value)}
        onChange={event => onChange(cleanDecimal(event.target.value))}
        onMouseEnter={() => onMouseEnter(amountInfo)}
        onMouseLeave={() => onMouseLeave(amountInfo)}
        data-testid="variable-amount-input"
      />
    </InputGroup>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  currency: state.settings.currency,
});

export const connectVariableAmount = connect(mapStateToProps);
export const VariableAmount = connectVariableAmount(_VariableAmount);
