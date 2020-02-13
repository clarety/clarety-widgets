export class Validations {
  // Utilities.

  requireField(errors, formData, field, message) {
    message = message || 'This is a required field.';

    if (!this.require(formData[field])) {
      errors.push({ field, message });
    }
  }

  emailField(errors, formData, field, message) {
    message = message || 'Please enter a valid email.';

    if (!this.email(formData[field])) {
      errors.push({ field, message });
    }
  }

  expiryField(errors, formData, field, monthField, yearField, message) {
    message = message || 'Invalid expiry date.'
    
    const month = formData[monthField];
    const year  = formData[yearField];

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      errors.push({ field, message });
    }
  }

  require(value) {
    return !!value;
  }

  email(value) {
    // NOTE: giant ugly regex from: https://emailregex.com/
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value);
  }
}
