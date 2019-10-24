export function validateEmail(email) {
  // NOTE: giant ugly regex from: https://emailregex.com/
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

export function requiredField(errors, formData, field) {
  const value = formData[field];
  if (!value) {
    errors.push({
      field: field,
      message: 'This is a required field.',
    });
  }
}
