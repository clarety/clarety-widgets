import React from 'react';
import { TextInput } from 'form/components';

export const AccountNumberInput = (props) => (
  <TextInput
    cleanFn={value => value.replace(/[^0-9]/g, '').substring(0, 10)}
    type="tel"
    {...props}
  />
);
