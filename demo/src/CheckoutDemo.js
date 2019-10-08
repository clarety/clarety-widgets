import React from 'react';
import { Checkout, setupCheckoutAxiosMock, withOverrides } from '../../src';
import '../../src/checkout/style.scss';

const CheckoutApp = withOverrides(Checkout, {});

CheckoutApp.setPanels([
  {
    component: 'LoginPanel',
    status: 'edit',
    settings: { allowGuest: true, createAccount: false },
  },
  {
    component: 'CustomerPanel',
  },
  {
    component: 'AddressPanel',
    settings: { addressType: 'international' },
  },
  {
    component: 'PaymentPanel',
  },
]);

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="checkout">
        <CheckoutApp />
      </div>
    );
  }
}
