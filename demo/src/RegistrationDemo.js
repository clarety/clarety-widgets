import React from 'react';
import { LoginPanel } from '../../src/shared/components';
import { ModePanel, DonatePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, PaymentPanel } from '../../src/registration/components';
import { ModeConnect, EventConnect, LoginConnect, TeamConnect, QtysConnect, OffersConnect, DetailsConnect, DonateConnect, ValidateConnect, PaymentConnect } from '../../src/registration/components';
import { Registration, setupRegistrationAxiosMock, withOverrides } from '../../src';
import enTranslations from '../../src/registration/intl/en.json';
import '../../src/registration/style.scss';

const RegistrationApp = withOverrides(Registration, {});

RegistrationApp.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

RegistrationApp.setPanels([
  {
    component: ModePanel,
    connect: ModeConnect,
    settings: {},
  },
  {
    component: DonatePanel,
    connect: DonateConnect,
    settings: {},
  },
  {
    component: EventPanel,
    connect: EventConnect,
    settings: {},
  },
  {
    component: TeamPanel,
    connect: TeamConnect,
    settings: {},
  },
  {
    component: QtysPanel,
    connect: QtysConnect,
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
        <RegistrationApp translations={enTranslations} />
      </div>
    );
  }
}
