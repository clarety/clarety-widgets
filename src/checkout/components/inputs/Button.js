import React from 'react';
import { Button as BsButton, Spinner as BsSpinner } from 'react-bootstrap';

export const Button = ({ title, isBusy, disabled, ...props }) => (
  <BsButton disabled={isBusy || disabled} {...props}>
    {isBusy
      ? <BsSpinner animation="border" size="sm" />
      : title
    }
  </BsButton>
);
