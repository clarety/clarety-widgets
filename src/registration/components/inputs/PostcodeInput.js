import React from 'react';
import { TextInput } from 'registration/components';

export const PostcodeInput = ({ country, ...props }) => {
  if (country === 'AU') {
    return (
      <TextInput
        cleanFn={value => value.replace(/[^0-9]/g, '').substring(0, 4)}
        type="tel"
        {...props}
      />
    );
  }

  return <TextInput {...props} />;
};
