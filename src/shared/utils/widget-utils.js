import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { Config } from 'clarety-utils';

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
  return getDecodedJwtCookie('jwtSession');
}

export function getJwtAccount() {
  return getDecodedJwtCookie('jwtAccount');
}

function getDecodedJwtCookie(cookieName) {
  let jwtString = Cookies.get(cookieName);
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

export function scrollIntoView(component) {
  const node = ReactDOM.findDOMNode(component);
  scrollIntoViewIfNeeded(node, {
    scrollMode: 'if-needed',
    block: 'start',
    behavior: 'smooth',
  });
}

export function currency(number) {
  const symbol = Config.get('currencySymbol') || '$';
  return `${symbol}${number.toFixed(2)}`;
}

export async function downloadFile(fileUrl) {
  try {
    // Fetch the file.
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Setup a hidden link.
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = '';

    // Add and click the hidden link.
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log('failed to download file:', error);
  }
}
