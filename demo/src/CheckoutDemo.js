import React from 'react';
import { Config, Checkout, setupCheckoutAxiosMock } from '../../src';

Config.init({
  instanceKey: 'clarety-baseline',
});

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <Checkout />
      </div>
    );
  }
}
