import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { TextInput } from 'form/components';
import { cleanDecimal } from 'form/utils';

export const CurrencyInput = ({ currency, ...props}) => (
  <InputGroup>
    <InputGroup.Prepend>
      <InputGroup.Text>
        {currency ? currency.symbol : '$'}
      </InputGroup.Text>
    </InputGroup.Prepend>
    <TextInput
      cleanFn={cleanDecimal}
      {...props}
    />
  </InputGroup>
);
