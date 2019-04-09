import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateWidget from './donate/views/DonateWidget/DonateWidget';
// import TestDonateWidget from './donate/views/TestDonateWidget/TestDonateWidget';
// import SubscribeFormView from './subscribe/views/SubscribeFormView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
  stripeKey: 'pk_test_5AVvhyJrg3yIEnWSMQVBl3mQ00mK2D2SOD',
});

renderWidget('donate-widget',
  <DonateWidget
    storeCode="AU"
    onceOfferId="1234"
    recurringOfferId="9876"
  />
);
