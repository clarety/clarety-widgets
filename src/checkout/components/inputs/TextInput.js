import React from 'react';
import { Form } from 'react-bootstrap';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureTextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.initialValue !== undefined) {
      props.onChange(props.field, props.initialValue);
    }
  }

  onChange = (event) => {
    const { field, cleanFn } = this.props;
    const cleanValue = cleanFn ? cleanFn(event.target.value) : event.target.value;
    this.props.onChange(field, cleanValue);
  };

  render() {
    let { field, label, placeholder, type, value, onChange, error, required, hideLabel } = this.props;
    if (!required && hideLabel) label += ' (Optional)';

    return (
      <Form.Group controlId={field}>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> (Optional)</span>}
        </Form.Label>

        <Form.Control
          value={value}
          onChange={this.onChange}
          placeholder={hideLabel ? label : placeholder}
          type={type || 'text'}
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
