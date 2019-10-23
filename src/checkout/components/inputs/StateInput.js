import React from 'react';
import { Form } from 'react-bootstrap';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureStateInput extends React.PureComponent {
  render() {
    const { value, field, onChange, placeholder, required, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          as="select"
          value={value}
          onChange={event => onChange(field, event.target.value)}
          required={required}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder}</option>
          <option value="QLD">QLD</option>
          <option value="NSW">NSW</option>
          <option value="VIC">VIC</option>
          <option value="ACT">ACT</option>
          <option value="NT">NT</option>
          <option value="SA">SA</option>
          <option value="WA">WA</option>
          <option value="TAS">TAS</option>
        </Form.Control>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class StateInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const { field } = this.props;

    const error = getValidationError(field, errors);

    return (
      <PureStateInput
        {...this.props}
        value={formData[field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

StateInput.contextType = FormContext;
