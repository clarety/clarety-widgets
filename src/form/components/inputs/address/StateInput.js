import React from 'react';
import { SelectInput } from 'form/components';

export const StateInput = ({ field, placeholder, country, required }) => (
  <SelectInput
    field={field}
    options={getStateOptions(country)}
    placeholder={placeholder}
    required={required}
  />
);

StateInput.defaultProps = {
  country: 'AU',
};

// TODO: move to utils, add other countries...
const getStateOptions = country => {
  return [
    { value: 'QLD', label: 'QLD' },
    { value: 'NSW', label: 'NSW' },
    { value: 'VIC', label: 'VIC' },
    { value: 'ACT', label: 'ACT' },
    { value: 'NT',  label: 'NT'  },
    { value: 'SA',  label: 'SA'  },
    { value: 'WA',  label: 'WA'  },
    { value: 'TAS', label: 'TAS' },
  ];
};
