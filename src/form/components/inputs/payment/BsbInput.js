import React from 'react';
import { TextInput } from 'form/components';

export const BsbInput = (props) => (
  <TextInput
    cleanFn={value => value.replace(/[^0-9]/g, '').substring(0, 6)}
    {...props}
  />
);
