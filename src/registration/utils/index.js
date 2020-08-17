import { getElementOptions } from 'shared/utils';
export * from './RegistrationApi';

export const currentYear = new Date().getFullYear();

export function iterate(from, to, callback) {
  const results = [];

  if (from < to) {
    // Count upwards.
    for (let index = from; index <= to; index++) {
      results.push(callback(index));
    }
  } else {
    // Count downwards.
    for (let index = from; index >= to; index--) {
      results.push(callback(index));
    }
  }

  return results;
}

export function scrollIntoView(elementRef) {
  // TODO: querySelector isn't very react-y...
  // Can we get a ref from the MiniCart component or something?
  const navbarElement = document.querySelector('.mini-cart');
  const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;
  const scrollTarget = elementRef.offsetTop - navbarHeight;
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
};

export const getExtendField = (columnKey, settings) => {
  return settings.extendForms[0].extendFields.find(field => field.columnKey === columnKey);
};

export function getGenderOptions(settings) {
  // Try to get from elements.
  let genderOptions = getElementOptions('customer.gender', settings);

  // Try to get from settings.
  if (!genderOptions) {
    genderOptions = settings['genderOptions'];
  }

  // Fallback to default.
  if (!genderOptions) {
    genderOptions = [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Prefer to not say', label: 'Prefer to not say' },
    ];
  }

  return genderOptions;
}

export function parseTeamErrors(result) {
  const errors = [];

  if (result.errors.RT005) {
    errors.push({
      field: 'team.name',
      message: 'This team name already exists', // TODO: translate!
    });
  }

  if (result.errors.RT003) {
    errors.push({
      field: 'team.passwordCheck',
      message: 'Incorrect password', // TODO: translate!
    });
  }

  return errors;
};
