import React from 'react';
import { Registrations, withOverrides, setupRegistrationsAxiosMock } from '../../src';
import enTranslations from '../../src/registrations/intl/en.json';

const App = withOverrides(Registrations, {});

export default class RegistrationsDemo extends React.Component {
  componentWillMount() {
    // setupRegistrationsAxiosMock();
  }

  render() {
    return (
      <div className="registrations">
        <App translations={enTranslations} />
      </div>
    );
  }
}
