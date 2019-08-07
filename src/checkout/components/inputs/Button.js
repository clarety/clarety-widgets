import React from 'react';
import { Button as BsButton, Spinner as BsSpinner } from 'react-bootstrap';

export const Button = ({ title, onClick, isBusy, disabled }) => (
  <BsButton onClick={onClick} disabled={isBusy || disabled}>
    {isBusy
      ? <BsSpinner animation="border" size="sm" />
      : title
    }
  </BsButton>
);
