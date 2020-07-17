import React from 'react';
import { getCountryOptions } from 'shared/utils';
import { SelectInput } from 'form/components';

export const CountryInput = ({ region, ...props }) => (
  <SelectInput
    options={getCountryOptions(region)}
    {...props}
  />
);
