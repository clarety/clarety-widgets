export const getValidationError = (field, errors) => {
  for (let error of errors) {
    if (error.field === field) return error;
  }

  return null;
};
