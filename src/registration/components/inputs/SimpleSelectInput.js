import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
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
    const { field, value, onChange, label, placeholder, translationId, error, required } = this.props;

    const options = this.props.options.filter(option => option.label.trim());

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          {label || <FormattedMessage id={translationId || `label.${field}`} />}
          {!required && <span className="optional"> (Optional)</span>}
        </Form.Label>

        <Form.Control
          as="select"
          value={value}
          onChange={event => onChange(field, event.target.value)}
          isInvalid={!!error}
        >
          <option value="" disabled hidden>{placeholder || 'Select'}</option>

          {options.map(option =>
            <option key={option.value} value={option.value}>{option.label}</option>
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
