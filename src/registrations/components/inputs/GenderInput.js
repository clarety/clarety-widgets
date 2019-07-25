import React from 'react';
import { SelectInput } from 'registrations/components';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
  { value: 'Other', label: 'Other' },
];

export const GenderInput = props => (
  <SelectInput
    {...props}
    options={genderOptions}
  />
);
