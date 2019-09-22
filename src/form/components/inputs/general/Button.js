import React from 'react';
import { Button as BsButton, Spinner } from 'react-bootstrap';

export const Button = ({ isBusy, children, ...otherProps }) => (
  <BsButton disabled={isBusy || otherProps.disabled} {...otherProps}>
    {isBusy
      ? <Spinner animation="border" size="sm" />
      : children
    }
  </BsButton>
);
