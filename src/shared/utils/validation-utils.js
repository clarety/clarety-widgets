import cardValidator from 'card-validator';

export function requiredField(errors, formData, field) {
  const value = formData[field];
  validateRequired(value, field, errors);
}

export function emailField(errors, formData, field) {
  const email = formData[field];
  validateEmail(email, field, errors);
}

export function validateRequired(value, field, errors) {
  if (!value) {
    errors.push({
      'field': field,
      'message': 'This is a required field.',
    });
  }
}

export function validateEmail(email, field, errors) {
  // NOTE: giant ugly regex from: https://emailregex.com/
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regex.test(email)) {
    errors.push({
      field: field,
      message: 'Please enter a valid email.',
    });
  }
}

export function validatePassword(password, field, errors) {
  const numberCount = password ? password.replace(/\D/g, '').length : 0;
  if (!password || password.length < 8 || numberCount < 2) {
    errors.push({
      'field': field,
      'message': 'Password must contain at least 8 characters including 2 numbers.',
    });
  }
}

export function validateCardNumber(cardNumber, field, errors) {
  const { isValid } = cardValidator.number(cardNumber);

  if (!isValid) {
    errors.push({
      field: field,
      message: 'Please enter a valid card number.',
    });
  }
}

export function validateCardExpiry(month, year, field, errors) {
  const { isValid } = cardValidator.expirationDate({ month, year }, 99);

  if (!isValid) {
    errors.push({
      field: field,
      message: 'Please enter a valid expiry date.',
    });
  }
}

export function validateCcv(ccv, field, errors) {
  const { isValid } = cardValidator.cvv(ccv);

  if (!isValid) {
    errors.push({
      field: field,
      message: 'Please enter a valid CCV.',
    });
  }
}
