import React from 'react';
import { Form } from 'react-bootstrap';
import { cleanCcv } from 'form/utils';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'checkout/components';
import './CcvInput.css';

class _CcvInput extends BaseInput {
  onChange = event => {
    this.setState({ value: cleanCcv(event.target.value) });
  };

  render() {
    const { field, placeholder, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={this.state.value}
          placeholder={placeholder || '•••'}
          onChange={this.onChange}
          onBlur={this.updateFormData}
          onKeyDown={this.onKeyDown}
          isInvalid={!!error}
          maxLength={4}
          className="ccv-input"
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const CcvInput = connectInput(_CcvInput);
