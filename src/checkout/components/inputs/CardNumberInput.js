import React from 'react';
import { Form } from 'react-bootstrap';
import { getValidationError, getCardType, formatCardNumber, cleanCardNumber } from 'form/utils';
import { FieldError } from 'form/components';
import { FormContext } from 'checkout/utils';
import './CardNumberInput.css';

class PureCardNumberInput extends React.PureComponent {
  onChange = event => {
    const { field, onChange } = this.props;
    const value = cleanCardNumber(event.target.value);
    onChange(field, value);
  };

  render() {
    const { value, field, placeholder, error, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={formatCardNumber(value)}
          className={'card-number ' + getCardType(value)}
          placeholder={placeholder || '•••• •••• •••• ••••'}
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
