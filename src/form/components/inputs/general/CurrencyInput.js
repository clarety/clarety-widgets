import React from 'react';
import { connect } from 'react-redux';
import { InputGroup } from 'react-bootstrap';
import { getSetting } from 'shared/selectors';
import { CurrencySymbol } from 'shared/components';
import { TextInput } from 'form/components';
import { cleanDecimal, displayInputDecimal } from 'form/utils';

export const _CurrencyInput = ({ currency, ...props }) => (
  <InputGroup>
    <InputGroup.Prepend>
      <InputGroup.Text>
        <CurrencySymbol />
      </InputGroup.Text>
    </InputGroup.Prepend>

    <TextInput
      type="tel"
      cleanFn={cleanDecimal}
      displayFn={displayInputDecimal}
      {...props}
    />
  </InputGroup>
);

const mapStateToProps = (state, ownProps) => ({
  currency: ownProps.currency || getSetting(state, 'currency'),
});

const actions = {};

export const CurrencyInput = connect(mapStateToProps, actions)(_CurrencyInput);
