import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateWidget from './donate/views/DonateWidget';
// import SubscribeWidget from './subscribe/views/SubscribeWidget';
import './index.css';

// import { setupAxiosMock } from './donate/mock-data/axios-mock';
// setupAxiosMock();

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('donate-widget-1',
  <DonateWidget
    singleOfferCode="widget-single"
    recurringOfferCode="widget-recurring"
    forceMdLayout
  />
);

renderWidget('donate-widget-2',
  <DonateWidget
    singleOfferCode="widget-single"
    recurringOfferCode="widget-recurring"
  />
);
