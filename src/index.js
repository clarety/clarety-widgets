import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import SubscribeWidget from './subscribe/views/SubscribeWidget';
import { setupAxiosMock } from './subscribe/mocks/axios-mock';
// import DonateWidget from './donate/views/DonateWidget';
// import { setupAxiosMock } from './donate/mocks/axios-mock';
import './index.css';

setupAxiosMock();

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('subscribe-widget-1',
  <SubscribeWidget
    listCode="newsletter"
  />
);

// renderWidget('donate-widget-1',
//   <DonateWidget
//     storeCode="AU"
//     singleOfferCode="widget-single"
//     recurringOfferCode="widget-recurring"
//     forceMdLayout
//   />
// );

// renderWidget('donate-widget-2',
//   <DonateWidget
//     storeCode="AU"
//     singleOfferCode="widget-single"
//     recurringOfferCode="widget-recurring"
//   />
// );
