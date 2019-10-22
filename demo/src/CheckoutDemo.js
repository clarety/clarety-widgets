import React from 'react';
import { Checkout, setupCheckoutAxiosMock, withOverrides } from '../../src';
import '../../src/checkout/style.scss';

const CheckoutApp = withOverrides(Checkout, {});

CheckoutApp.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

CheckoutApp.setPanels([
  {
    component: 'LoginPanel',
    connect: 'CheckoutLoginConnect',
    settings: {
      allowGuest: true,
      createAccount: false,
    },
  },
  {
    component: 'CustomerPanel',
    settings: {},
  },
  {
    component: 'AddressPanel',
    settings: {
      addressType: 'international',
    },
  },
  {
    component: 'ShippingPanel',
    settings: {},
  },
  {
    component: 'CheckoutPaymentPanel',
    settings: {},
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
