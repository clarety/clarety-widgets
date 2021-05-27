import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureEmailInput extends React.PureComponent {
  render() {
    let { field, label, placeholder, value, onChange, error, required, hideLabel } = this.props;
    if (!required && hideLabel) placeholder = label + ` (${t('optional', 'Optional')})`;

    return (
      <Form.Group controlId={field}>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>

        <Form.Control
          value={value}
          onChange={event => onChange(field, event.target.value.trim())}
          placeholder={hideLabel ? label : placeholder}
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
