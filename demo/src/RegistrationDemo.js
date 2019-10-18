import React from 'react';
import { Registration, withOverrides, setupRegistrationAxiosMock } from '../../src';
import enTranslations from '../../src/registration/intl/en.json';
import '../../src/registration/style.scss';

const RegistrationApp = withOverrides(Registration, {});

RegistrationApp.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

RegistrationApp.setShowAddress(true);

RegistrationApp.setPanels([
  {
    component: 'ModePanel',
    settings: {},
  },
  {
    component: 'DonatePanel',
    settings: {},
  },
  {
    component: 'EventPanel',
    settings: {},
  },
  {
    component: 'QtysPanel',
    settings: {},
  },
  {
    component: 'RegistrationLoginPanel',
    settings: {
      allowGuest: false,
      createAccount: true,
      showFirstName: true,
      showLastName: true,
    },
  },
  {
    component: 'RegistrationOffersPanel',
    settings: {
      showOffers: true,
      showPrefill: true,
    },
  },
  {
    component: 'ValidatePanel',
    settings: {},
  },
  {
    component: 'RegistrationPaymentPanel',
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
