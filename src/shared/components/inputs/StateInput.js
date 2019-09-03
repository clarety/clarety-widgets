import React from 'react';
import { Form } from 'react-bootstrap';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'shared/components/inputs';

class _StateInput extends BaseInput {
  onChange = event => {
    const { field, updateFormData } = this.props;
    updateFormData({ [field]: event.target.value });
  };

  render() {
    const { field, placeholder, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          as="select"
          value={this.props.value}
          onChange={this.onChange}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder}</option>
          <option value="QLD">QLD</option>
          <option value="NSW">NSW</option>
          <option value="VIC">VIC</option>
          <option value="ACT">ACT</option>
          <option value="NT">NT</option>
          <option value="SA">SA</option>
          <option value="WA">WA</option>
          <option value="TAS">TAS</option>
        </Form.Control>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const StateInput = connectInput(_StateInput);
