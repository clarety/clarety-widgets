import React from 'react';
import { Form } from 'react-bootstrap';
import ReactPhoneNumberInput from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css';
import { Config } from 'clarety-utils';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

enLabels['SZ'] = 'Eswatini';

class PurePhoneInput extends React.PureComponent {
  render() {
    let { field, label, placeholder, value, onChange, error, required, hideLabel, country, showCountrySelect = false } = this.props;
    if (hideLabel) placeholder = label;
    if (!required) placeholder += ` (${t('optional', 'Optional')})`;

    country = country || Config.get('phoneCountry') || 'AU';
    if (country === 'UK') country = 'GB';

    const className = error ? 'form-control is-invalid' : 'form-control';

    return (
      <Form.Group controlId={field}>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>

        <ReactPhoneNumberInput
          value={value}
          onChange={value => onChange(field, value)}
          placeholder={placeholder}
          limitMaxLength={true}
          country={country}
          showCountrySelect={showCountrySelect}
          labels={enLabels}
          displayInitialValueAsLocalNumber
          inputClassName={className}
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
