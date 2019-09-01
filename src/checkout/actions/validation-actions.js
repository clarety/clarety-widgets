import { validateRequired, validateEmail, validatePassword } from 'checkout/utils';
import { validateCardNumber, validateCardExpiry, validateCcv } from 'checkout/utils';
import { setErrors } from 'checkout/actions';

export function validateCreateAccount({ onSuccess }) {
  return (dispatch, getState) => {
    const { formData } = getState();
    const errors = [];

    _validateEmail(formData, 'customer.email', errors);
    _validatePassword(formData, 'customer.password', errors);

    dispatch(setErrors(errors));
    if (errors.length === 0) onSuccess();
  };
}

export function validateLogin({ onSuccess }) {
  return (dispatch, getState) => {
    const { formData } = getState();
    const errors = [];

    _validateEmail(formData, 'customer.email', errors);
    _validateRequired(formData, 'customer.password', errors);

    dispatch(setErrors(errors));
    if (errors.length === 0) onSuccess();
  };
}

export function validateCheckEmail({ onSuccess }) {
  return (dispatch, getState) => {
    const { formData } = getState();
    const errors = [];

    _validateEmail(formData, 'customer.email', errors);

    dispatch(setErrors(errors));
    if (errors.length === 0) onSuccess();
  };
}

export function validatePersonalDetails({ onSuccess }) {
  return (dispatch, getState) => {
    const { formData } = getState();
    const errors = [];

    _validateRequired(formData, 'customer.firstName', errors);
    _validateRequired(formData, 'customer.lastName', errors);

    _validateRequired(formData, 'customer.dateOfBirthDay', errors);
    _validateRequired(formData, 'customer.dateOfBirthMonth', errors);
    _validateRequired(formData, 'customer.dateOfBirthYear', errors);

    _validateRequired(formData, 'sale.source', errors);

    dispatch(setErrors(errors));
    if (errors.length === 0) onSuccess();
  };
}

export function validateShippingDetails({ onSuccess }) {
  return (dispatch, getState) => {
    const { formData } = getState();
    const errors = [];

    _validateRequired(formData, 'customer.delivery.address1', errors);
    _validateRequired(formData, 'customer.delivery.suburb', errors);
    _validateRequired(formData, 'customer.delivery.state', errors);
    _validateRequired(formData, 'customer.delivery.postcode', errors);

    if (!formData['billingIsSameAsShipping']) {
      _validateRequired(formData, 'customer.billing.address1', errors);
      _validateRequired(formData, 'customer.billing.suburb', errors);
      _validateRequired(formData, 'customer.billing.state', errors);
      _validateRequired(formData, 'customer.billing.postcode', errors);
    }

    dispatch(setErrors(errors));
    if (errors.length === 0) onSuccess();
  };
}

export function validateCreditCardFields({ onSuccess }) {
  return (dispatch, getState) => {
    const { formData } = getState();
    const errors = [];

    _validateRequired(formData, 'payment.cardName', errors);
    _validateCardNumber(formData, 'payment.cardNumber', errors);
    _validateCardExpiry(formData, 'payment.expiry', 'payment.expiryMonth', 'payment.expiryYear', errors);
    _validateCcv(formData, 'payment.ccv', errors);

    dispatch(setErrors(errors));
    if (errors.length === 0) onSuccess();
  };
}


// Wrapper functions to extract values from form data.

function _validateRequired(formData, field, errors) {
  const value = formData[field];
  validateRequired(value, field, errors);
}

function _validateEmail(formData, field, errors) {
  const value = formData[field];
  validateEmail(value, field, errors);
}

function _validatePassword(formData, field, errors) {
  const value = formData[field];
  validatePassword(value, field, errors);
}

function _validateCardNumber(formData, field, errors) {
  const value = formData[field];
  validateCardNumber(value, field, errors);
}

function _validateCardExpiry(formData, field, monthField, yearField, errors) {
  const expiryMonth = formData[monthField];
  const expiryYear  = formData[yearField];
  validateCardExpiry(expiryMonth, expiryYear, field, errors);
}

function _validateCcv(formData, field, errors) {
  const value = formData[field];
  validateCcv(value, field, errors);
}
