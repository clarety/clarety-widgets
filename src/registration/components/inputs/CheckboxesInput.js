import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureCheckboxesInput extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initialValue, value, field, onChange } = props;

    if (initialValue && !value) {
      onChange(field, initialValue);
    }
  }

  onChecked(option, isChecked) {
    const { field, value, onChange } = this.props;

    if (isChecked) {
      onChange(field, [...value, option.value]);
    } else {
      onChange(field, value.filter(v => v !== option.value));
    }
  }

  render() {
    const { field, value, options, disabled, label, explanation, error, required } = this.props;

    return (
      <Form.Group>
        <Form.Label>
          {label}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>

        {options.map(option =>
          <FormCheck key={option.value} id={`${field}.${option.value}`}>
            <FormCheck.Input
              checked={value.includes(option.value)}
              onChange={event => this.onChecked(option, event.target.checked)}
              disabled={disabled}
            />
            <FormCheck.Label>{option.label}</FormCheck.Label>
          </FormCheck>
        )}

        {explanation &&
          <p className="explanation-text" dangerouslySetInnerHTML={{ __html: explanation }} />
        }

        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class CheckboxesInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureCheckboxesInput
        {...this.props}
        value={formData[this.props.field] || []}
        onChange={onChange}
        error={error}
      />
    );
  }
}

CheckboxesInput.contextType = FormContext;
