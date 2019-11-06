import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureTextInput extends React.PureComponent {
  render() {
    const { field, label, placeholder, explanation, value, onChange, type, translationId, error, disabled, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          {label || <FormattedMessage id={translationId || `label.${field}`} />}
          {required && ' *'}
        </Form.Label>

        <Form.Control
          value={value}
          onChange={event => onChange(field, event.target.value)}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          isInvalid={!!error}
        />

        <FieldError error={error} />

        {explanation && <p className="explanation-text">{explanation}</p>}
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
