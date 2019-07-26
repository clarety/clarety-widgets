import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Navbar } from 'react-bootstrap';

export const Brand = () => (
  <Navbar.Brand>
    <FormattedMessage id="app.title" />
  </Navbar.Brand>
);
