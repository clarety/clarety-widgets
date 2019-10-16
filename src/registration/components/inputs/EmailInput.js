import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'registration/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureEmailInput extends React.PureComponent {
  render() {
    const { field, value, onChange, translationId, error, disabled, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={translationId || `label.${field}`} />
          {required && ' *'}
        </Form.Label>
        <Form.Control
          value={value}
          onChange={event => onChange(field, event.target.value.trim())}
          disabled={disabled}
          isInvalid={!!error}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class EmailInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureEmailInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

EmailInput.contextType = FormContext;
