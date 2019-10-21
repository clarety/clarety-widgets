import React from 'react';
import { getElementOptions } from 'shared/utils';

export const FormContext = React.createContext();

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

export function calcProgress(participantCount, participantIndex) {
  return 40 + (40 / participantCount) * (participantIndex + 1);
}

export function scrollIntoView(elementRef) {
  // TODO: querySelector isn't very react-y...
  // Can we get a ref from the MiniCart component or something?
  const navbarElement = document.querySelector('.navbar');
  const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;

  var scrollTarget = elementRef.offsetTop - navbarHeight;
  window.scroll({ top: scrollTarget, behavior: 'smooth' });
};

export const getExtendField = (columnKey, settings) => {
  return settings.extendForms[0].extendFields.find(field => field.columnKey === columnKey);
};

export function getGenderOptions(settings, ) {
  let genderOptions = getElementOptions('customer.gender', settings);

  if (genderOptions) {
    return genderOptions;
  } else {
    return [
      { value: 'Male',   label: 'Male' },
      { value: 'Female', label: 'Female' },
    ];
  }
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