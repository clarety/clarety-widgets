import creditCardType from 'credit-card-type';

export const getCardType = number => {
  if (!number) return 'unknown';

  const matches = creditCardType(number);
  if (!matches[0]) return 'unknown';

  return matches[0].type;
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
