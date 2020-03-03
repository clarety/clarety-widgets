import React from 'react';
import { TextInput } from 'form/components';

export const PostcodeInput = (props) => (
  <TextInput
    cleanFn={value => value.replace(/[^0-9]/g, '').substring(0, 4)}
    pattern="\d*"
    {...props}
  />
);
