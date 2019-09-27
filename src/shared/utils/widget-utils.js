import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { Config } from 'clarety-utils';

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
  let jwtString = Cookies.get('jwtSession');
  if (!jwtString) {
    // return null;

    // TODO: remove! this is just for testing using mock endpoints.
    console.log('no jwt found, using mock jwt...');
    jwtString = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek';
  };

  const jwt = jwtDecode(jwtString);
  jwt.jwtString = jwtString;

  return jwt;
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
  return `$${number.toFixed(2)}`;
}
