import React from 'react';
import { Form } from 'react-bootstrap';
import ReactPhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Config } from 'clarety-utils';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PurePhoneInput extends React.PureComponent {
  render() {
    const { field, placeholder, value, onChange, error, required } = this.props;

    const country = Config.get('phoneCountry');

    return (
      <Form.Group controlId={field}>
        <ReactPhoneNumberInput
          value={value}
          onChange={value => onChange(field, value)}
          placeholder={placeholder}
          limitMaxLength={true}
          country={country}
          showCountrySelect={false}
          required={required}
          inputClassName="form-control"
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class PhoneInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PurePhoneInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

PhoneInput.contextType = FormContext;
