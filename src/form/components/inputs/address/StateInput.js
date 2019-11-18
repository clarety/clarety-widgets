import React from 'react';
import { getStateOptions } from 'shared/utils';
import { SelectInput } from 'form/components';

export const StateInput = ({ field, placeholder, country, required }) => {
  if (placeholder && required) placeholder += ' *';

  return (
    <SelectInput
      field={field}
      options={getStateOptions(country)}
      placeholder={placeholder}
      required={required}
    />
  );
};

StateInput.defaultProps = {
  country: 'AU',
};
