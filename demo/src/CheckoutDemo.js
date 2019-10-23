import React from 'react';
import { LoginPanel, PaymentPanel } from '../../src/shared/components';
import { CustomerPanel, AddressPanel, ShippingPanel } from '../../src/checkout/components';
import { LoginConnect, PaymentConnect } from '../../src/checkout/components';
import { Checkout, setupCheckoutAxiosMock } from '../../src';
import '../../src/checkout/style.scss';

Checkout.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

Checkout.setPanels([
  {
    component: LoginPanel,
    connect: LoginConnect,
    settings: {
      allowGuest: true,
      createAccount: false,
    },
  },
  {
    component: CustomerPanel,
    settings: {},
  },
  {
    component: AddressPanel,
    settings: {
      addressType: 'international',
    },
  },
  {
    component: ShippingPanel,
    settings: {},
  },
  {
    component: PaymentPanel,
    connect: PaymentConnect,
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
        <Checkout />
      </div>
    );
  }
}
