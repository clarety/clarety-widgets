import React from 'react';
import { Form } from 'react-bootstrap';

export const FieldError = ({ error }) => {
  if (!error) return null;

  return (
    <Form.Control.Feedback type="invalid">
      {error.message}
    </Form.Control.Feedback>
  );
};
