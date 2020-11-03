import cardValidator from 'card-validator';
import { t } from 'shared/translations';

export function requiredField(errors, formData, field, message) {
  const value = formData[field];
  validateRequired(value, field, errors, message);
}

export function emailField(errors, formData, field, message) {
  const email = formData[field];
  validateEmail(email, field, errors, message);
}

export function phoneNumberField(errors, formData, field, message) {
  const phoneNumber = formData[field];
  validatePhoneNumber(phoneNumber, field, errors, message);
}

export function cardNumberField(errors, formData, field, message) {
  const cardNumber = formData[field];
  validateCardNumber(cardNumber, field, errors, message);
}

export function cardExpiryField(errors, formData, field, monthField, yearField, message) {
  const month = formData[monthField];
  const year = formData[yearField];
  validateCardExpiry(month, year, field, errors, message);
}

export function ccvField(errors, formData, field, message) {
  const ccv = formData[field];
  validateCcv(ccv, field, errors, message);
}

export function validateRequired(value, field, errors, message) {
  if (!value) {
    errors.push({
      'field': field,
      'message': message || t('invalid-required'),
    });
  }
}

export function validateEmail(email, field, errors, message) {
  // NOTE: giant ugly regex from: https://emailregex.com/
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(email)) {
    errors.push({
      field: field,
      message: message || t('invalid-email'),
    });
  }
}

export function validatePhoneNumber(phoneNumber, field, errors, message) {
  if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 14) {
    errors.push({
      field: field,
      message: message || t('invalid-phone'),
    });
  }
}

export function validatePassword(password, field, errors, message) {
  const numberCount = password ? password.replace(/\D/g, '').length : 0;
  if (!password || password.length < 8 || numberCount < 2) {
    errors.push({
      'field': field,
      'message': message || t('invalid-password'),
    });
  }
}

export function validateCardNumber(cardNumber, field, errors, message) {
  const { isValid } = cardValidator.number(cardNumber);

  if (!isValid) {
    errors.push({
      field: field,
      message: message || t('invalid-card-number'),
    });
  }
}

export function validateCardExpiry(month, year, field, errors, message) {
  const { isValid } = cardValidator.expirationDate({ month, year }, 99);

  if (!isValid) {
    errors.push({
      field: field,
      message: message || t('invalid-card-expiry'),
    });
  }
}

export function validateCcv(ccv, field, errors, message) {
  const isValid = ccv && (ccv.length === 3 || ccv.length === 4);

  if (!isValid) {
    errors.push({
      field: field,
      message: message || t('invalid-ccv'),
    });
  }
}

export function validateDob({ field, day, month, year, comparisonDate, minAge, maxAge, errors }) {
  day   = Number(day);
  month = Number(month) - 1
  year  = Number(year);

  comparisonDate = comparisonDate || new Date();

  if (minAge) {
    const turnsMinAge = new Date(year + minAge, month, day);
    if (turnsMinAge > comparisonDate) {
      errors.push({
        'field': field,
        'message': `${t('invalid-min-age')} ${minAge}`,
      });
    }
  }

  if (maxAge) {
    const turnsMaxAge = new Date(year + maxAge, month, day);
    if (turnsMaxAge < comparisonDate) {
      errors.push({
        'field': field,
        'message': `${t('invalid-max-age')} ${maxAge}`,
      });
    }
  }
}
