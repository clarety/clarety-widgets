import React from 'react';
import { Registrations, withOverrides, setupRegistrationsAxiosMock, registrationsEnTranslations } from '../../src';

const App = withOverrides(Registrations, {});

export default class RegistrationsDemo extends React.Component {
  componentWillMount() {
    setupRegistrationsAxiosMock();
  }

  render() {
    return (
      <div className="registrations">
        <App translations={registrationsEnTranslations} />
      </div>
    );
  }
}
