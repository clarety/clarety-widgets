import React from 'react';
import { getCountryOptions } from 'shared/utils';
import { SimpleSelectInput } from 'registration/components';

export const CountryInput = (props) => (
  <SimpleSelectInput
    {...props}
    options={getCountryOptions()}
  />
);
