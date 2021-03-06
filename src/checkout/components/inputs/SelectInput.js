import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureSelectInput extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initialValue, value, field, onChange } = props;

    if (initialValue && !value) {
      onChange(field, initialValue);
    }
  }

  render() {
    let { value, field, onChange, options, label, placeholder, required, error, hideLabel, getTranslationKey } = this.props;
    if (!required && hideLabel) placeholder = label + ` (${t('optional', 'Optional')})`;

    return (
      <Form.Group controlId={field}>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
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

export class SelectInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const { field } = this.props;

    const error = getValidationError(field, errors);

    return (
      <PureSelectInput
        {...this.props}
        value={formData[field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

SelectInput.contextType = FormContext;
