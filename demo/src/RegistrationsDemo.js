import React from 'react';
import { Registrations, withOverrides, setupRegistrationsAxiosMock } from '../../src';
import enTranslations from '../../src/registrations/intl/en.json';

const RegistrationsApp = withOverrides(Registrations, {});

RegistrationsApp.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

RegistrationsApp.setPanels([
  {
    component: 'EventPanel',
    settings: {},
  },
  {
    component: 'QtysPanel',
    settings: {},
  },
  {
    component: 'RegistrationsLoginPanel',
    settings: {
      allowGuest: false,
      createAccount: true,
      showFirstName: true,
      showLastName: true,
    },
  },
  {
    component: 'NamesPanel',
    settings: { showOffers: true },
  },
  {
    component: 'ValidatePanel',
    settings: {},
  },
  {
    component: 'RegistrationsPaymentPanel',
    settings: {},

  },
]);

export default class RegistrationsDemo extends React.Component {
  componentWillMount() {
    // setupRegistrationsAxiosMock();
  }

  render() {
    return (
      <div className="registrations">
        <RegistrationsApp translations={enTranslations} />
      </div>
    );
  }
}
