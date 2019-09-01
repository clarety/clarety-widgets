import { validateRequired, validateEmail, validatePassword } from 'checkout/utils';
import { validateCardNumber, validateCardExpiry, validateCcv } from 'checkout/utils';
import { setErrors } from 'checkout/actions';

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


// TODO: remove temp wrapper functions.

function _validateRequired(formData, field, errors) {
  const value = formData[field];
  validateRequired(value, field, errors);
}
