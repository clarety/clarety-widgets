import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

const defaultOptions = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

/**
 * A select input that lets you pick from boolean true/false instead of strings.
 */
class PureTrueFalseSelectInput extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.initialValue) {
      props.onChange(props.field, props.initialValue);
    }
  }

  render () {
    const { field, value, onChange, label, placeholder, error } = this.props;
    const options = this.props.options || defaultOptions;

    return (
      <Form.Group controlId={field}>
        <Form.Label>{label}</Form.Label>

        <Form.Control
          as="select"
          value={String(value)}
          onChange={event => onChange(field, event.target.value === 'true')}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder || t('select', 'Select')}</option>

          {options.map(option => {
            return (
              <option key={String(option.value)} value={String(option.value)}>
                {t(option.label, option.label)}
              </option>
            );
          })}
        </Form.Control>

        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class TrueFalseSelectInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureTrueFalseSelectInput
        {...this.props}
        value={formData[this.props.field] ?? ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

TrueFalseSelectInput.contextType = FormContext;
