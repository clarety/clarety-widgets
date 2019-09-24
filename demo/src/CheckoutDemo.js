import React from 'react';
import { Checkout, setupCheckoutAxiosMock, withOverrides } from '../../src';

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
