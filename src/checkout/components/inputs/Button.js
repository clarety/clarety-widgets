import React from 'react';
import { Button as BsButton, Spinner as BsSpinner } from 'react-bootstrap';

export const Button = ({ title, isBusy, onClick }) => (
  <BsButton onClick={onClick} style={{ minWidth: '130px' }}> {/* TODO: use a stylesheet for min-width... */}
    {isBusy
      ? <BsSpinner animation="border" size="sm" />
      : title
    }
  </BsButton>
);

export const EditButton = ({ onClick }) => (
  <BsButton onClick={onClick} variant="link">Edit</BsButton>
);
