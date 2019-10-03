import React from 'react';
import { Cart, setupCartAxiosMock } from '../../src';
import Cookies from 'js-cookie';

// Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJjYXJ0VWlkIjoiOGMyNzU2YjItZjAxOC00YzI3LWEwMjUtYzMxZmNhN2U0ODJiIn0.WDXbbj84bUH7zGVNEEeSK1VwuEfBY8Lt6stiEr6Yhek');

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    setupCartAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <Cart/>
      </div>
    );
  }
}
