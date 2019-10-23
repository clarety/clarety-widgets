import React from 'react';
import { Form } from 'react-bootstrap';
import { FormContext } from 'shared/utils';
import { getValidationError, cleanCcv } from 'form/utils';
import { FieldError } from 'form/components';
import './CcvInput.css';

class PureCcvInput extends React.PureComponent {
  onChange = event => {
    const { field, onChange } = this.props;
    const value = cleanCcv(event.target.value);
    onChange(field, value);
  };

  render() {
    const { value, field, placeholder, error, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={value}
          placeholder={placeholder || '•••'}
          onChange={this.onChange}
          required={required}
          isInvalid={!!error}
          maxLength={4}
          className="ccv-input"
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class CcvInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureCcvInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

CcvInput.contextType = FormContext;
