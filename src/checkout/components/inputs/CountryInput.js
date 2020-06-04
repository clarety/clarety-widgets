import React from 'react';
import { countryOptions } from 'shared/utils';
import { SelectInput } from 'checkout/components';

export const CountryInput = (props) => (
  <SelectInput
    {...props}
    options={countryOptions}
  />
);
