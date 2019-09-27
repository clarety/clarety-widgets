import React from 'react';
import Cookies from 'js-cookie';
import { Checkout, setupCheckoutAxiosMock, withOverrides } from '../../src';

Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek');

const App = withOverrides(Checkout, {});

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="checkout">
        <App />
      </div>
    );
  }
}
