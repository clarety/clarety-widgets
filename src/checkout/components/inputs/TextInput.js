import React from 'react';
import { Form } from 'react-bootstrap';
import { FormContext } from 'checkout/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureTextInput extends React.PureComponent {
  render() {
    const { field, placeholder, type, value, onChange, error, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={value}
          onChange={event => onChange(field, event.target.value)}
          placeholder={placeholder}
          type={type || 'text'}
          required={required}
          isInvalid={!!error}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class TextInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureTextInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

TextInput.contextType = FormContext;
