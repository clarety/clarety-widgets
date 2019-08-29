import React from 'react';
import { Form } from 'react-bootstrap';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'checkout/components';

class _RxTextInput extends BaseInput {
  render() {
    const { field, placeholder, type, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.updateFormData}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          type={type || 'text'}
          isInvalid={!!error}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const RxTextInput = connectInput(_RxTextInput);
