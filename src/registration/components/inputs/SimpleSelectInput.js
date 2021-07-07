import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureSimpleSelectInput extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.initialValue) {
      props.onChange(props.field, props.initialValue);
    }
  }

  render () {
    const { field, value, onChange, label, placeholder, error, required, getTranslationKey } = this.props;

    const options = this.props.options.filter(option => option.label.trim());

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          {label}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>

        <Form.Control
          as="select"
          value={value}
          onChange={event => onChange(field, event.target.value)}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder || t('select', 'Select')}</option>

          {options.map(option => {
            const tKey = getTranslationKey ? getTranslationKey(option.value, option.label) : option.label;
            return (
              <option key={option.value} value={option.value}>
                {t(tKey, option.label)}
              </option>
            );
          })}
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
