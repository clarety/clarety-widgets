import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { FormContext } from 'checkout/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

export class PureCheckboxInput extends React.PureComponent {
  render() {
    const { field, checked, label, error, onChange } = this.props;

    return (
      <Form.Group controlId={field}>
        <FormCheck>
          <FormCheck.Input
            checked={checked}
            onChange={event => onChange(field, event.target.checked)}
          />
          <FormCheck.Label>{label}</FormCheck.Label>
        </FormCheck>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class CheckboxInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureCheckboxInput
        {...this.props}
        checked={formData[this.props.field] || false}
        onChange={onChange}
        error={error}
      />
    );
  }
}

CheckboxInput.contextType = FormContext;
