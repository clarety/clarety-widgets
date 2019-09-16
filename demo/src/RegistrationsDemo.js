import React from 'react';
import { RegistrationsApp, withOverrides, setupRegistrationsAxiosMock } from '../../src';
import enTranslations from '../../src/registrations/intl/en.json';

const App = withOverrides(RegistrationsApp, {});

export default class RegistrationsDemo extends React.Component {
  componentWillMount() {
    setupRegistrationsAxiosMock();
  }

  render() {
    return (
      <div className="registrations">
        <App translations={enTranslations} />
      </div>
    );
  }
}
