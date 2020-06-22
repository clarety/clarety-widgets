import React from 'react';
import { getStateOptions } from 'shared/utils';
import { TextInput, SimpleSelectInput } from 'registration/components';

export const StateInput = ({ country, ...props }) => {
  const stateOptions = getStateOptions(country);

  if (stateOptions) {
    return <SimpleSelectInput options={stateOptions} {...props} />;
  } else {
    return <TextInput {...props} />;
  }
};
