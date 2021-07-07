import React from 'react';
import { getCountryOptions } from 'shared/utils';
import { SimpleSelectInput } from 'registration/components';

export const CountryInput = ({ region, ...props }) => (
  <SimpleSelectInput
    options={getCountryOptions(region)}
    getTranslationKey={(value, label) => {
      return [`country-${value}`, label];
    }}
    {...props}
  />
);
