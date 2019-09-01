import { types } from '.';

export const updateFormData = formData => ({
  type: types.updateFormData,
  formData: formData,
});

export const resetFormData = () => ({
  type: types.resetFormData,
});

export const updateCustomerFormData = customer => ({
  type: types.updateFormData,
  formData: {
    'customer.firstName':        customer.firstName,
    'customer.lastName':         customer.lastName,
    'customer.phone1':           customer.phone1,
    'customer.phone2':           customer.phone2,
    'customer.mobile':           customer.mobile,
    'customer.dateOfBirthDay':   customer.dateOfBirthDay,
    'customer.dateOfBirthMonth': customer.dateOfBirthMonth,
    'customer.dateOfBirthYear':  customer.dateOfBirthYear,
  },
});
