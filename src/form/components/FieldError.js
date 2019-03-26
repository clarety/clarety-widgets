import React from 'react';
import { Form } from 'react-bootstrap';

const FieldError = ({ error }) => {
  if (!error) return null;

  return (
    <Form.Control.Feedback type="invalid">
      {error.message}
    </Form.Control.Feedback>
  );
};

export default FieldError;
