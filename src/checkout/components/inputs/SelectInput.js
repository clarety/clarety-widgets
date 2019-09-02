import React from 'react';
import { Form } from 'react-bootstrap';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'checkout/components';

class _SelectInput extends BaseInput {
  onChange = event => {
    const { field, updateFormData } = this.props;
    updateFormData({ [field]: event.target.value });
  };

  render() {
    const { field, options, placeholder, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          as="select"
          value={this.props.value}
          onChange={this.onChange}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder || 'Select'}</option>

          {options.map(option =>
            <option key={option.value} value={option.value}>{option.label}</option>
          )}
        </Form.Control>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const SelectInput = connectInput(_SelectInput);
