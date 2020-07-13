import React from 'react';
import { DonationPanel, LoginPanel } from '../../src/shared/components';
import { ModePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, PaymentPanel } from '../../src/registration/components';
import { MerchPanel, MerchConnect } from '../../src/registration/components';
import { ModeConnect, EventConnect, RegistrationLoginConnect, TeamConnect, QtysConnect, OffersConnect, DetailsConnect, DonationConnect, ValidateConnect, PaymentConnect } from '../../src/registration/components';
import { Registration, setupRegistrationAxiosMock } from '../../src';
import enTranslation from '../../src/registration/translations/en';
import '../../src/registration/style.scss';

Registration.init();

Registration.setClientIds({
  // dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
  // dev:  '60efcad7dc9df95cb418032c39565a79', // mdc
  dev: 'ab0c9407ba7f0581ebc49fa787049e80', // a21
  prod: '',
});

Registration.setLanguages({
  en: enTranslation,
});

Registration.setPanels([
  {
    component: ModePanel,
    connect: ModeConnect,
    settings: {},
  },
  {
    component: EventPanel,
    connect: EventConnect,
    settings: {
      showStateButtons: true,
      showPromoCode: true,
    },
  },
  {
    component: DonationPanel,
    connect: DonationConnect,
    settings: {
      showFrequencySelect: false,
      showNoneButton: true,
    },
  },
  {
    component: LoginPanel,
    connect: RegistrationLoginConnect,
    settings: {
      allowGuest: false,
      createAccount: true,
      showFirstName: true,
      showLastName: true,
    },
  },
  {
    component: QtysPanel,
    connect: QtysConnect,
    settings: {},
  },
  {
    component: TeamPanel,
    connect: TeamConnect,
    settings: {},
  },
  {
    component: OffersPanel,
    connect: OffersConnect,
    settings: {
      showOffers: true,
      showPrefill: true,
    },
  },
  {
    component: DetailsPanel,
    connect: DetailsConnect,
    settings: {
      showBillingAddress: true,
      showDeliveryAddress: true,
    },
  },
  {
    component: MerchPanel,
    connect: MerchConnect,
    settings: {},
  },
  {
    component: ValidatePanel,
    connect: ValidateConnect,
    settings: {},
  },
  {
    component: PaymentPanel,
    connect: PaymentConnect,
    settings: {
      title: 'Registration Summary',
      submitBtnText: 'Submit Registration',
    },
  },
]);

export default class RegistrationDemo extends React.Component {
  componentWillMount() {
    // setupRegistrationAxiosMock();
  }

  render() {
    return (
      <div className="registrations">
        <Registration
          storeId="1"
          storeCode="AU"

          // a21
          seriesId="26"
          prevSeriesId="25"
          donationSingleOfferId="151"

          // mdc
          // seriesId="9"
          // prevSeriesId="8"
          // donationSingleOfferId="55"

          // baseline
          // seriesId="3"
          // prevSeriesId="2"
          // donationSingleOfferId="8"
          
          sourceId="17"
          responseId="e9c2e351d90b11e996fd"
          emailResponseId="1234"

          showLanguageSelect={true}
        />
      </div>
    );
  }
}
