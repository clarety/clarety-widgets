import React from 'react';
import { connect } from 'react-redux';
import { InputGroup } from 'react-bootstrap';
import { getSetting } from 'shared/selectors';
import { TextInput } from 'form/components';
import { cleanDecimal, displayInputDecimal } from 'form/utils';

export const _CurrencyInput = ({ currency, ...props}) => (
  <InputGroup>
    <InputGroup.Prepend>
      <InputGroup.Text>
        {currency ? `${currency.code} ${currency.symbol}` : '$'}
      </InputGroup.Text>
    </InputGroup.Prepend>

    <TextInput
      {...props}
      cleanFn={cleanDecimal}
      displayFn={displayInputDecimal}
    />
  </InputGroup>
);

const mapStateToProps = (state, ownProps) => ({
  currency: ownProps.currency || getSetting(state, 'currency'),
});

const actions = {};

export const CurrencyInput = connect(mapStateToProps, actions)(_CurrencyInput);
