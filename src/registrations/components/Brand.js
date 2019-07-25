import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Navbar } from 'react-bootstrap';

export const Brand = () => (
  <Navbar.Brand>
    <h1>yeah brand</h1>
    <FormattedMessage id="app.title" />
  </Navbar.Brand>
);
