import React from 'react';
import { connect } from 'react-redux';
import ReactPhoneNumberInput from 'react-phone-number-input';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import enLabels from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css';
import { Config } from 'shared/utils/config';
import { t, getLanguage } from 'shared/translations';
import { getSetting } from 'shared/selectors';
import { FieldError } from 'form/components';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';

enLabels['SZ'] = 'Eswatini';

const _PhoneInput = ({ value, placeholder, country, onChange, error, hideErrors, required, showCountrySelect = false, mainSiteUrl }) => {
  country = country || Config.get('phoneCountry') || 'AU';
  if (country === 'UK') country = 'GB';

  if (placeholder && !required) placeholder += t('optional-label', ' (Optional)');

  const className = error ? 'form-control is-invalid' : 'form-control';

  return (
    <React.Fragment>
      <ReactPhoneNumberInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        limitMaxLength={true}
        country={country}
        showCountrySelect={showCountrySelect}
        labels={getLabels()}
        displayInitialValueAsLocalNumber
        inputClassName={className}
        flagsPath={`${mainSiteUrl}neutrino/hub01/images/flags/`}
      />
      {!hideErrors && <FieldError error={error} />}
    </React.Fragment>
  );
}

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
    mainSiteUrl: getSetting(state, 'mainSiteUrl') || '',
  };
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: text => dispatch(updateFormData(field, text)),
  };
};

export const PhoneInput = connect(mapStateToProps, mapDispatchToProps)(_PhoneInput);


// Phone country labels.

const cachedLabels = {};

function getLabels() {
  const lang = getLanguage();

  if (!cachedLabels[lang]) {
    const labels = { ...enLabels };

    for (const country of getCountries()) {
      // Translate label and append calling code.
      const countryLabel = t(labels[country], labels[country]);
      const callingCode = getCountryCallingCode(country);
      labels[country] = `${countryLabel} +${callingCode}`;
    }

    // 'International' label.
    labels['ZZ'] = t(labels['ZZ'], labels['ZZ']);

    cachedLabels[lang] = labels;
  }

  return cachedLabels[lang];
}
