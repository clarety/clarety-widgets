import React from 'react';
import { getStateOptions } from 'shared/utils';
import { SelectInput, TextInput } from 'checkout/components';

export const StateInput = ({ country, ...props }) => {
  const stateOptions = getStateOptions(country);

  if (stateOptions) {
    return <SelectInput options={stateOptions} {...props} />;
  } else {
    return <TextInput {...props} />;
  }
};
