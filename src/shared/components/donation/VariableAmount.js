import React from 'react';
import { connect } from 'react-redux';
import { Form, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from 'form/utils';

const _VariableAmount = ({ value, amountInfo, isSelected, onChange, currency }) => {
  let input = React.createRef();

  return (
    <div className="mt-3 mb-1 mx-3 d-lg-none">
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>{currency.symbol}</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          placeholder="Enter Amount"
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
    currency: state.settings.currency,
  }
};

export const connectVariableAmount = connect(mapStateToProps);
export const VariableAmount = connectVariableAmount(_VariableAmount);
