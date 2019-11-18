import React from 'react';
import { getStateOptions } from 'shared/utils';
import { SimpleSelectInput } from 'registration/components';

export const StateInput = (props) => (
  <SimpleSelectInput
    {...props}
    options={getStateOptions(props.country || 'AU')}
  />
);
