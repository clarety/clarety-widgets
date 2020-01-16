import React from 'react';
import { DonationPanel, LoginPanel } from '../../src/shared/components';
import { ModePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, RegistrationPaymentPanel } from '../../src/registration/components';
import { ModeConnect, EventConnect, RegistrationLoginConnect, TeamConnect, QtysConnect, OffersConnect, DetailsConnect, DonationConnect, ValidateConnect, RegistrationPaymentConnect } from '../../src/registration/components';
import { Registration, setupRegistrationAxiosMock } from '../../src';
import enTranslations from '../../src/registration/intl/en.json';
import '../../src/registration/style.scss';

Registration.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
  // dev:  '60efcad7dc9df95cb418032c39565a79',    // mdc
  prod: '',
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
    component: ValidatePanel,
    connect: ValidateConnect,
    settings: {},
  },
  {
    component: RegistrationPaymentPanel,
    connect: RegistrationPaymentConnect,
    settings: {},
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
          translations={enTranslations}

          storeId="0"
          storeCode="AU"

          // mdc
          // seriesId="9"
          // prevSeriesId="8"
          // donationSingleOfferId="55"

          // baseline
          seriesId="3"
          prevSeriesId="2"
          donationSingleOfferId="8"
          
          sourceId="17"
          responseId="e9c2e351d90b11e996fd"
          emailResponseId="1234"
        />
      </div>
    );
  }
}
