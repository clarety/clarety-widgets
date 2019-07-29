import React from 'react';
import { ClaretyConfig, Checkout, setupCheckoutAxiosMock } from '../../src';

ClaretyConfig.init({
  instanceKey: 'clarety-baseline',
});

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    // setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="m-5">
        <Checkout />
      </div>
    );
  }
}
