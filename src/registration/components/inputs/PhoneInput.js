import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import ReactPhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Config } from 'clarety-utils';
import { FormContext } from 'registration/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PurePhoneInput extends React.PureComponent {
  render() {
    const { field, value, onChange, translationId, error, required } = this.props;
    const country = Config.get('phoneCountry');

    const className = error ? 'form-control is-invalid' : 'form-control';

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={translationId || `label.${field}`} />
          {required && ' *'}
        </Form.Label>
        <ReactPhoneNumberInput
          value={value}
          onChange={value => onChange(field, value)}
          limitMaxLength={true}
          inputClassName={className}
          country={country}
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
