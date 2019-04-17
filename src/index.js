import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateWidget from './donate/views/DonateWidget';
// import SubscribeWidget from './subscribe/views/SubscribeWidget';
import './index.css';

import { setupAxiosMock } from './donate/mock-data/axios-mock';
setupAxiosMock();

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('donate-widget-1',
  <DonateWidget
    storeCode="AU"
    onceOfferId="1234"
    recurringOfferId="9876"
    forceMobileLayout
  />
);

renderWidget('donate-widget-2',
  <DonateWidget
    storeCode="AU"
    onceOfferId="1234"
    recurringOfferId="9876"
  />
);
