import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

export const QtyInput = ({ value, onChange, onInputChange }) => (
    <InputGroup className="input-group form-quantity-selector">
      <span className="input-group-prepend">
        <InputGroup.Prepend>
          <Button variant="quantity-change" onClick={() => onChange(Math.max(0, value - 1))} >
              -
          </Button>
        </InputGroup.Prepend>
      <React.Fragment>
          <Form.Control
              className="input-number"
              value={value}
              onChange={(event) => onInputChange(event.target.value)}
          />
        </React.Fragment>
        <InputGroup.Append>
          <Button variant="quantity-change" onClick={() => onChange(value + 1)} >
              +
          </Button>
        </InputGroup.Append>
      </span>
    </InputGroup>
);