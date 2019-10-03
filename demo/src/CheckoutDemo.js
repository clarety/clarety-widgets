import React from 'react';
import Cookies from 'js-cookie';
import { Checkout, setupCheckoutAxiosMock, withOverrides } from '../../src';

Cookies.set('jwtSession', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0VWlkIjoiY3J0XzQ3a2oiLCJzYWxlSWQiOiIxMjgxIiwiaXNzIjoiZGV2IiwiZXhwIjoxNTcwMDcxMTU5LCJzdWIiOiIiLCJhdWQiOiIifQ.WWiAneMcbb04ahc9xmEpnsh2nM6sXPm76FnnkJjVuQU');

const App = withOverrides(Checkout, {});

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    // setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="checkout">
        <App />
      </div>
    );
  }
}
