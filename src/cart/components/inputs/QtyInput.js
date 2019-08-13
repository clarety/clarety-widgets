import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

export const QtyInput = ({ value, onChange }) => (
  <InputGroup className="input-group-qty">
    <InputGroup.Prepend>
      <Button onClick={() => onChange(Math.max(0, value - 1))}>-</Button>
    </InputGroup.Prepend>
    <Form.Control value={value} plaintext readOnly />
    <InputGroup.Append>
      <Button onClick={() => onChange(value + 1)}>+</Button>
    </InputGroup.Append>
  </InputGroup>
);
