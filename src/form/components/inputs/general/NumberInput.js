import React from 'react';
import { TextInput } from 'form/components';

export const NumberInput = (props) => (
  <TextInput
    cleanFn={value => value.replace(/[^0-9]/g, '')}
    type="tel"
    {...props}
  />
);
