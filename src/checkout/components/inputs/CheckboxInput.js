import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'checkout/components';

export class _CheckboxInput extends BaseInput {
  onChange = event => {
    const { field, updateFormData } = this.props;
    updateFormData({ [field]: event.target.checked });
  };

  render() {
    const { field, value, label, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <FormCheck>
          <FormCheck.Input
            checked={value || false}
            onChange={this.onChange}
          />
          <FormCheck.Label>{label}</FormCheck.Label>
        </FormCheck>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const CheckboxInput = connectInput(_CheckboxInput);
