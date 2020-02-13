export class Validations {
  validateCustomerPanel(errors, getState) {
    const { formData } = getState();

    this.requireField(errors, formData, 'customer.firstName');
    this.requireField(errors, formData, 'customer.lastName');
    this.emailField(errors, formData, 'customer.email');

    return errors.length === 0;
  }

  validatePaymentPanel(errors, getState) {
    const { formData } = getState();

    this.requireField(errors, formData, 'payment.cardNumber');
    this.expiryField(errors, formData, 'payment.expiry', 'payment.expiryMonth', 'payment.expiryYear');
    this.requireField(errors, formData, 'payment.ccv');

    return errors.length === 0;
  }

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
