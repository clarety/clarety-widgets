import React from 'react';
import { Form } from 'react-bootstrap';
import { FormContext } from 'shared/utils';
import { getValidationError, getCardType, formatCardNumber, cleanCardNumber } from 'form/utils';
import { FieldError } from 'form/components';
import './CardNumberInput.css';

class PureCardNumberInput extends React.PureComponent {
  onChange = event => {
    const { field, onChange } = this.props;
    const value = cleanCardNumber(event.target.value);
    onChange(field, value);
  };

  render() {
    let { value, field, label, placeholder, error, required, hideLabel } = this.props;
    if (!required) label += ' (Optional)';

    return (
      <Form.Group controlId={field}>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> (Optional)</span>}
        </Form.Label>

        <Form.Control
          value={formatCardNumber(value)}
          className={'card-number ' + getCardType(value)}
          placeholder={hideLabel ? label : (placeholder || '•••• •••• •••• ••••')}
          onChange={this.onChange}
          required={required}
          isInvalid={!!error}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class CardNumberInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureCardNumberInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

CardNumberInput.contextType = FormContext;
