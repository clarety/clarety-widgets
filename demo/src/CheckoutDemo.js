import React from 'react';
import { LoginPanel, PaymentPanel } from '../../src/shared/components';
import { CheckoutCustomerPanel, AddressPanel, ShippingPanel } from '../../src/checkout/components';
import { LoginConnect, CheckoutCustomerConnect, AddressConnect, ShippingConnect, PaymentConnect } from '../../src/checkout/components';
import { Checkout, setupCheckoutAxiosMock } from '../../src';
import '../../src/checkout/style.scss';

Checkout.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
  prod: '',
});

Checkout.setPanels([
  {
    component: LoginPanel,
    connect: LoginConnect,
    settings: {
      allowGuest: true,
      createAccount: false,
      hideLabels: true,
    },
  },
  {
    component: CheckoutCustomerPanel,
    connect: CheckoutCustomerConnect,
    settings: {
      hideLabels: true,
    },
  },
  {
    component: AddressPanel,
    connect: AddressConnect,
    settings: {
      addressType: 'international',
      hideLabels: true,
    },
  },
  {
    component: ShippingPanel,
    connect: ShippingConnect,
    settings: {},
  },
  {
    component: PaymentPanel,
    connect: PaymentConnect,
    settings: {
      hideLabels: true,
    },
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
