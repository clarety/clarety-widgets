import React from 'react';
import { Form } from 'react-bootstrap';
import ReactPhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Config } from 'clarety-utils';
import { FieldError } from 'form/components';
import { BaseInput, connectInput } from 'shared/components/inputs';

class _PhoneInput extends BaseInput {
  onChange = value => this.setState({ value });

  render() {
    const { field, placeholder, error } = this.props;
    const country = Config.get('phoneCountry');

    const className = error ? 'form-control is-invalid' : 'form-control';

    return (
      <Form.Group controlId={field}>
        <ReactPhoneNumberInput
          value={this.state.value}
          onChange={this.onChange}
          onBlur={this.updateFormData}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          limitMaxLength={true}
          inputClassName={className}
          country={country}
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export const PhoneInput = connectInput(_PhoneInput);
