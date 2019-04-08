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
  return number.replace(/[^0-9]/g, '').substring(0, 20);
};

export const formatExpiry = (month, year) => {
  if (!month) return '';

  if (!year) {
    if (month === '0' || month === '1') return month;
    return `${month} / `;
  }

  return `${month} / ${year}`;
};

export const cleanExpiry = expiry => {
  let [month, year] = expiry.split(' / ');

  if (month) month = _cleanDigits(month);
  if (year) year = _cleanDigits(year);

  if (month.length === 1 && month > 1) month = `0${month}`;
  if (month > 12) month = '1';
  if (month === '00') month = '0';

  return { month, year };
};

const _cleanDigits = string => string.replace(/[^0-9]/g, '').substring(0, 2);
