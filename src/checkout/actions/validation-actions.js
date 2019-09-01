import { validateRequired, validateEmail, validatePassword } from 'checkout/utils';
import { validateCardNumber, validateCardExpiry, validateCcv } from 'checkout/utils';
import { types, setErrors } from 'checkout/actions';

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

    if (errors.length === 0) {
      dispatch(onSuccess());
    }
  };
};


// TODO: remove temp wrapper functions.

function _validateRequired(formData, field, errors) {
  const value = formData[field];
  validateRequired(value, field, errors);
}
