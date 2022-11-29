import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureTextAreaInput extends React.PureComponent {
  onChange = (event) => {
    const { field, cleanFn } = this.props;
    const cleanValue = cleanFn ? cleanFn(event.target.value) : event.target.value;
    this.props.onChange(field, cleanValue);
  };

  render() {
    const { field, label, placeholder, explanation, value, error, disabled, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          {label}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>

        <Form.Control
          value={value}
          onChange={this.onChange}
          placeholder={placeholder}
          as="textarea"
          rows={3}
          disabled={disabled}
          isInvalid={!!error}
        />

        <FieldError error={error} />

        {explanation && <p className="explanation-text">{explanation}</p>}
      </Form.Group>
    );
  }
}

export class TextAreaInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureTextAreaInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

TextAreaInput.contextType = FormContext;
