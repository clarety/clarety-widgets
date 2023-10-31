import React from 'react';
import ReactPhoneNumberInput from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css';
import { Form } from 'react-bootstrap';
import { Config } from 'clarety-utils';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

enLabels['SZ'] = 'Eswatini';

class PurePhoneInput extends React.PureComponent {
  render() {
    const { field, label, value, onChange, error, required } = this.props;
    
    let country = this.props.country || Config.get('phoneCountry');
    if (country === 'UK') country = 'GB';

    const className = error ? 'form-control is-invalid' : 'form-control';

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          {label}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>
        <ReactPhoneNumberInput
          value={value}
          onChange={value => onChange(field, value)}
          limitMaxLength={true}
          inputClassName={className}
          country={country}
          labels={enLabels}
          displayInitialValueAsLocalNumber
          flagsPath="neutrino/hub01/images/flags/"
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
