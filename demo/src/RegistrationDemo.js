import React from 'react';
import { LoginPanel } from '../../src/shared/components';
import { ModePanel, DonatePanel, EventPanel, TeamPanel, QtysPanel, OffersPanel, DetailsPanel, ValidatePanel, PaymentPanel } from '../../src/registration/components';
import { LoginConnect, PaymentConnect } from '../../src/registration/components';
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
    settings: {},
  },
  {
    component: DonatePanel,
    settings: {},
  },
  {
    component: EventPanel,
    settings: {},
  },
  {
    component: TeamPanel,
    settings: {},
  },
  {
    component: QtysPanel,
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
    settings: {
      showOffers: true,
      showPrefill: true,
    },
  },
  {
    component: DetailsPanel,
    settings: {
      showAddress: true,
    },
  },
  {
    component: ValidatePanel,
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
