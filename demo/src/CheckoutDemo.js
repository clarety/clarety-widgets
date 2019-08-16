import React from 'react';
import { Checkout, setupCheckoutAxiosMock } from '../../src';

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="checkout m-5">
        <Checkout />
      </div>
    );
  }
}
