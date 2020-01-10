import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureRadioGroupInput extends React.PureComponent {
  render() {
    const { field, value, options, onChange, label, translationId, error, required } = this.props;

    return (
      <Form.Group>
        <Form.Label>
          {label || <FormattedMessage id={translationId || `label.${field}`} />}
          {required && ' *'}
        </Form.Label>

        {options.map(option =>
          <FormCheck key={option.value} id={`${field}-${option.value}`}>
            <FormCheck.Input
              type="radio"
              name={field}
              checked={option.value === value}
              onChange={event => onChange(field, option.value)}
            />
            <FormCheck.Label><span dangerouslySetInnerHTML={{ __html: option.label }} /></FormCheck.Label>
          </FormCheck>
        )}

        <FieldError error={error} />
      </Form.Group>      
    );
  }
}

export class RadioGroupInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureRadioGroupInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

RadioGroupInput.contextType = FormContext;
