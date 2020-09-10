import React from 'react';
import { TextInput } from 'registration/components';

export const NumberInput = (props) => (
  <TextInput
    cleanFn={value => value.replace(/[^0-9]/g, '')}
    type="tel"
    {...props}
  />
);
