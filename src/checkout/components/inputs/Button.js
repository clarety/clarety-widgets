import React from 'react';
import { Button as BsButton, Spinner as BsSpinner } from 'react-bootstrap';

export const Button = ({ title, onClick, isBusy, disabled, variant }) => (
  <BsButton onClick={onClick} disabled={isBusy || disabled} variant={variant}>
    {isBusy
      ? <BsSpinner animation="border" size="sm" />
      : title
    }
  </BsButton>
);
