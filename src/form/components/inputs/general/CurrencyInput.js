import React from 'react';
import { connect } from 'react-redux';
import { InputGroup } from 'react-bootstrap';
import { getSetting } from 'shared/selectors';
import { TextInput } from 'form/components';
import { cleanDecimal } from 'form/utils';

export const _CurrencyInput = ({ currency, ...props}) => (
  <InputGroup>
    <InputGroup.Prepend>
      <InputGroup.Text>
        {currency ? `${currency.code} ${currency.symbol}` : '$'}
      </InputGroup.Text>
    </InputGroup.Prepend>

    <TextInput cleanFn={cleanDecimal} {...props} />
  </InputGroup>
);

const mapStateToProps = (state, ownProps) => ({
  currency: ownProps.currency || getSetting(state, 'currency'),
});

export const CurrencyInput = connect(mapStateToProps)(_CurrencyInput);
