import { getAmountPanelSelection } from 'donate/selectors';

export class Validations {
  validateAmountPanel(errors, getState) {
    const state = getState();

    // Make sure an amount has been selected.
    const selection = getAmountPanelSelection(state);
    if (!selection.amount) {
      errors.push({
        message: 'Please select a donation amount.',
      });
    }

    return errors.length === 0;
  }

  validateDetailsPanel(errors, getState) {
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
    return /^.+@.+\..+$/.test(value);
  }
}
