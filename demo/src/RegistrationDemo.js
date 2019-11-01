import React from 'react';
import { DonationPanel, LoginPanel } from '../../src/shared/components';
import { ModePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, PaymentPanel } from '../../src/registration/components';
import { ModeConnect, EventConnect, LoginConnect, TeamConnect, QtysConnect, OffersConnect, DetailsConnect, DonationConnect, ValidateConnect, PaymentConnect } from '../../src/registration/components';
import { Registration, setupRegistrationAxiosMock } from '../../src';
import enTranslations from '../../src/registration/intl/en.json';
import '../../src/registration/style.scss';

Registration.setClientIds({
  // dev:  '82ee4a2479780256c9bf9b951f5d1cfb', // baseline
  dev:  '60efcad7dc9df95cb418032c39565a79',    // mdc
  prod: '',
});

Registration.setPanels([
  {
    component: ModePanel,
    connect: ModeConnect,
    settings: {},
  },
  // {
  //   component: DonationPanel,
  //   connect: DonationConnect,
  //   settings: {
  //     showFrequencySelect: false,
  //   },
  // },
  {
    component: EventPanel,
    connect: EventConnect,
    settings: {},
  },
  {
    component: LoginPanel,
    connect: LoginConnect,
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
      showAddress: true,
    },
  },
  {
    component: ValidatePanel,
    connect: ValidateConnect,
    settings: {},
  },
  {
    component: PaymentPanel,
    connect: PaymentConnect,
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

          seriesId="9"
          previousSeriesId="8"

          singleOfferId="8"
          recurringOfferId="17"

          sourceId="17"
          responseId="e9c2e351d90b11e996fd"
          emailResponseId="1234"
        />
      </div>
    );
  }
}
