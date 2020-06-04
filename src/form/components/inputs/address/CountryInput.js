import React from 'react';
import { countryOptions } from 'shared/utils';
import { SelectInput } from 'form/components';

export const CountryInput = (props) => (
  <SelectInput
    {...props}
    options={countryOptions}
  />
);
