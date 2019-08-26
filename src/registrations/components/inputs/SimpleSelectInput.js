import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'registrations/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureSimpleSelectInput extends React.PureComponent {
  render () {
    const { field, value, onChange, placeholder, translationId, error, required } = this.props;

    const options = this.props.options.filter(option => option.label.trim());

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={translationId || `label.${field}`} />
          {required && ' *'}
        </Form.Label>

        <Form.Control
          as="select"
          value={value}
          onChange={event => onChange(field, event.target.value)}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder || 'Select'}</option>

          {options.map(option =>
            <option value={option.value}>{option.label}</option>
          )}
        </Form.Control>

        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class SimpleSelectInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureSimpleSelectInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

SimpleSelectInput.contextType = FormContext;
