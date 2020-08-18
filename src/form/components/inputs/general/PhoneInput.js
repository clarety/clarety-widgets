import React from 'react';
import { connect } from 'react-redux';
import ReactPhoneNumberInput from 'react-phone-number-input';
import { Config } from 'clarety-utils';
import { FieldError } from 'form/components';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';

const _PhoneInput = ({ value, placeholder, country, onChange, error, required }) => {
  country = country || Config.get('phoneCountry') || 'AU';

  if (placeholder && required) placeholder += ' *';

  return (
    <React.Fragment>
      <ReactPhoneNumberInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        limitMaxLength={true}
        country={country}
        showCountrySelect={false}
        displayInitialValueAsLocalNumber
        inputClassName="form-control"
      />
      <FieldError error={error} />
    </React.Fragment>
  );
}

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: text => dispatch(updateFormData(field, text)),
  };
};

export const PhoneInput = connect(mapStateToProps, mapDispatchToProps)(_PhoneInput);
