export const getCardType = number => {
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3(4|7)/.test(number)) return 'amex';
  if (/^6011/.test(number)) return 'discovery';

  return 'unknown';
};

// Split numbers into groups of 4.
export const formatCardNumber = number => {
  const groups = [];

  for (let i = 0; i < number.length; i += 4) {
    const group = number.substring(i, i + 4);
    groups.push(group);
  }

  return groups.join(' ');
}

// Remove anything that isn't a number.
export const cleanCardNumber = number => {
  return number.replace(/[^0-9]/g, '');
};
