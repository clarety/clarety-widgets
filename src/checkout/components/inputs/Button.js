import React from 'react';
import { Button as BsButton, Spinner as BsSpinner } from 'react-bootstrap';

export const Button = ({ title, onClick, isBusy, disabled, variant, type }) => (
  <BsButton onClick={onClick} disabled={isBusy || disabled} variant={variant} type={type}>
    {isBusy
      ? <BsSpinner animation="border" size="sm" />
      : title
    }
  </BsButton>
);
