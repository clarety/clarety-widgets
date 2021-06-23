import React from 'react';
import { LoginPanel, PaymentPanel } from '../../src/shared/components';
import { CheckoutCustomerPanel, AddressPanel, ShippingPanel, DonationPanel } from '../../src/checkout/components';
import { LoginConnect, CheckoutCustomerConnect, AddressConnect, ShippingConnect, PaymentConnect, DonationConnect } from '../../src/checkout/components';
import { Checkout, initTranslations, setupCheckoutAxiosMock } from '../../src';
import '../../src/checkout/style.scss';

initTranslations({
  translationsPath: 'translations/{{lng}}.json',
  defaultLanguage: 'en',
});

Checkout.init();

Checkout.setClientIds({
  //dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
  // dev: 'ab0c9407ba7f0581ebc49fa787049e80', // a21
  dev: '43fa6c712a8bf4fcae2f84e3ecd59454', // bible league
  prod: '',
});

Checkout.setPanels([
  {
    component: DonationPanel,
    connect: DonationConnect,
    settings: {
      showNoneButton: true,
      priceHandleStyle: 'price-only',
    },
  },
  {
    component: LoginPanel,
    connect: LoginConnect,
    settings: {
      hideLabels: true,
      allowGuest: true,
      createAccount: false,
      useSelfServiceLogout: true,
    },
  },
  {
    component: CheckoutCustomerPanel,
    connect: CheckoutCustomerConnect,
    settings: {
      hideLabels: true,
      showCustomerType: true,
      showSource: true,
    },
  },
  {
    component: AddressPanel,
    connect: AddressConnect,
    settings: {
      hideLabels: true,
      showCountry: true,
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
      title: 'Payment Details',
      submitBtnText: 'Place Order',
    },
  },
]);

export default class CheckoutDemo extends React.Component {
  componentWillMount() {
    // setupCheckoutAxiosMock();
  }

  render() {
    return (
      <div className="checkout">
        <Checkout
          addressFinderKey="ADDRESSFINDER_DEMO_KEY"
          defaultCountry="NZ"

          // A21
          storeUid="str_8lo8"
          donationOfferId="19"
          donationOfferUid="ofr_y2qy"
        />
      </div>
    );
  }
}
