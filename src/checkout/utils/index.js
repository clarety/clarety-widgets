import React from 'react';

export const FormContext = React.createContext();

export function currency(number) {
  return `$${number.toFixed(2)}`;
}
