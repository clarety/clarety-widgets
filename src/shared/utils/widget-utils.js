import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { t } from 'shared/translations';
import { Config } from 'shared/utils/config';
import { ClaretyApi } from 'shared/utils/clarety-api';
import i18next from 'i18next';

export const FormContext = React.createContext();

export function renderWidget(elementId, component) {
  const element = document.getElementById(elementId);
  if (element) {
    ReactDOM.render(component, element);
  } else {
    if (Config.get('env') === 'dev') {
      console.log(`[Clarety] Not rendering widget, element id '${elementId}' not found.`);
    }
  }
}

export function getJwtSession() {
  return getDecodedJwtCookie('jwtSession') || getDecodedJwtCookie('session-jwt');
}

export function getJwtAccount() {
  return getDecodedJwtCookie('jwtAccount');
}

export function getJwtCustomer() {
  return getDecodedJwtCookie('jwtCustomer');
}

function getDecodedJwtCookie(cookieName) {
  const jwtString = Cookies.get(cookieName);
  if (!jwtString) {
    return null;
  };

  const jwt = jwtDecode(jwtString);
  jwt.jwtString = jwtString;

  return jwt;
}

let _nextId = 0;
export function nextId() {
  return _nextId++;
}

/** @returns {{ fbp?: string, fbc?: string }} */
export function getFacebookCookies() {
  return {
    fbp: Cookies.get('_fbp'),
    fbc: Cookies.get('_fbc'),
  };
}

export function setApiFacebookCookies() {
  const facebookCookies = getFacebookCookies();

  if (facebookCookies.fbp) {
    ClaretyApi.setHeader('clarety-fbp', facebookCookies.fbp);
  }

  if (facebookCookies.fbc) {
    ClaretyApi.setHeader('clarety-fbc', facebookCookies.fbc);
  }
}

export function getCmsConfirmContent(elementId, fields) {
  let confirmContent = document
    .querySelector(`#${elementId}`)
    .closest('.cms-zone')
    .nextElementSibling
    .querySelector('.cms-zone')
    .innerHTML;

  for (let field of fields) {
    confirmContent = confirmContent.replace(field.match, field.value);
  }

  return confirmContent;
}

export function scrollIntoView(component, offset = 100) {
  const node = ReactDOM.findDOMNode(component);
  if (node) {
    const rect = node.getBoundingClientRect();

    const shouldScroll = rect.top < offset || rect.bottom > window.innerHeight;

    if (shouldScroll) {
      window.scrollTo({
        top: rect.top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
    }
  }
}

export function currency(number) {
  const symbol = Config.get('currencySymbol') || '$';
  return `${symbol}${number.toFixed(2)}`;
}

export function getCurrencySymbol(currency, hideCurrencyCode) {
  if (hideCurrencyCode || !currency.code || currency.code === 'NOK') {
    return currency.symbol;
  }

  if (currency.code === 'HKD') {
    return 'HK$';
  }

  return currency.code + ' ' + currency.symbol;
}

export function formatPrice(amount, currency, hideCurrencyCode = false, hideCents = false) {
  const currencySymbol = getCurrencySymbol(currency, hideCurrencyCode);

  const formattedAmount = Number(amount).toLocaleString(i18next.language, {
    minimumFractionDigits: hideCents ? 0 : 2,
    maximumFractionDigits: hideCents ? 0 : 2,
  })
  
  return currencySymbol + formattedAmount;
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertOptions(options) {
  if (!options || !Array.isArray(options)) return undefined;
  return options.map(option => ({ value: option, label: option }));
}

export const getCustomerTypeOptions = () => [
  { value: 'individual', label: t('individual', 'Individual') },
  { value: 'business',   label: t('business', 'Business') },
];

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

export function appendQueryString(url, data) {
  const queryParams = [];
  for (const [key, value] of Object.entries(data)) {
    if (value) queryParams.push(`${key}=${value}`);
  }

  if (!queryParams.length) return url;

  const queryString = queryParams.join('&');

  return url.includes('?')
    ? `${url}&${queryString}`
    : `${url}?${queryString}`;
}

export function moveInArray(arr, from, to) {    
  // Remove the item from it's current position.
  const [item] = arr.splice(from, 1);

  // Insert the item to its new position.
  arr.splice(to, 0, item);
}

export function range(min, max) {
  const values = [];

  for (let i = min; i <= max; i++) {
    values.push(i);
  }

  return values;
}
