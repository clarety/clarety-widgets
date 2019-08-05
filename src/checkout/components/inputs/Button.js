import React from 'react';
import { Button as BsButton, Spinner as BsSpinner } from 'react-bootstrap';

export const Button = ({ title, onClick, isBusy, disabled }) => (
  <BsButton
    onClick={onClick}
    disabled={isBusy || disabled}
    style={{ minWidth: '130px' }} // TODO: use a stylesheet for min-width...
  >
    {isBusy
      ? <BsSpinner animation="border" size="sm" />
      : title
    }
  </BsButton>
);

export const EditButton = ({ onClick }) => (
  <BsButton onClick={onClick} variant="link">Edit</BsButton>
);
