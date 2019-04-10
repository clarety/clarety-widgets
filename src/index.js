import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateWidget from './donate/views/DonateWidget/DonateWidget';
// import TestDonateWidget from './donate/views/TestDonateWidget/TestDonateWidget';
// import SubscribeFormView from './subscribe/views/SubscribeFormView';
import './index.css';

import { setupAxiosMock } from './donate/mock-data/axios-mock';
setupAxiosMock();

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('donate-widget',
  <DonateWidget
    storeCode="AU"
    onceOfferId="1234"
    recurringOfferId="9876"
  />
);
