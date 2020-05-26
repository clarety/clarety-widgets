import React from 'react';
import { countryOptions } from 'shared/utils';
import { SimpleSelectInput } from 'registration/components';

export const CountryInput = (props) => (
  <SimpleSelectInput
    {...props}
    options={countryOptions}
  />
);
