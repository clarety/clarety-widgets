import React from 'react';
import { Form } from 'react-bootstrap';
import { getCardType, formatCardNumber, cleanCardNumber } from 'form/utils';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'checkout/components';
import './CardNumberInput.css';

class _RxCardNumberInput extends BaseInput {
  onChange = event => {
    this.setState({ value: cleanCardNumber(event.target.value) });
  };

  render() {
    const { field, placeholder, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={formatCardNumber(this.state.value)}
          className={'card-number ' + getCardType(this.state.value)}
          placeholder={placeholder || '•••• •••• •••• ••••'}
          onChange={this.onChange}
          onBlur={this.updateFormData}
          onKeyDown={this.onKeyDown}
          isInvalid={!!error}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const RxCardNumberInput = connectInput(_RxCardNumberInput);
