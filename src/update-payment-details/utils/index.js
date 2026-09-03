export const settingsMap = (settings) => {
  // check if we have an auth error.
  if (settings.status === 'error') {
    for (const error of settings.validationErrors) {
      if (error.field === 'jwtCustomer') {
        return {
          hasAuthError: true,
        };
      }
    }
  }

  return settings;
};

export function recurrenceStatusClassName(status) {
  return `recurrence-status ${(status || '').toLowerCase().replaceAll(' ' , '-')}`;
}
