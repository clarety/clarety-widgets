import React from 'react';
import { getCountryOptions } from 'shared/utils';
import { SelectInput } from 'checkout/components';

export const CountryInput = ({ region, ...props }) => (
  <SelectInput
    options={getCountryOptions(region)}
    {...props}
  />
);
