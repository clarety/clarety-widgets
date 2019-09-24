// TODO: move to 'form' or 'shared'...

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
  const isValid = regex.test(email);
  if (!isValid) {
    errors.push({
      'field': field,
      'message': 'Please enter a valid email.',
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
  // TODO: don't depend on stripe, not all checkouts will use it...
  if (!window.Stripe.card.validateCardNumber(cardNumber)) {
    errors.push({
      field: field,
      message: 'Please enter a valid card number.',
    });
  }
}

export function validateCardExpiry(expiryMonth, expiryYear, field, errors) {
  // TODO: don't depend on stripe, not all checkouts will use it...
  if (!window.Stripe.card.validateExpiry(expiryMonth, expiryYear)) {
    errors.push({
      field: field,
      message: 'Please enter a valid expiry date.',
    });
  }
}

export function validateCcv(ccv, field, errors) {
  // TODO: don't depend on stripe, not all checkouts will use it...
  if (!window.Stripe.card.validateCVC(ccv)) {
    errors.push({
      field: field,
      message: 'Please enter a valid CCV.',
    });
  }
}
