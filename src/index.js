import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateWidget from './donate/views/DonateWidget';
// import SubscribeFormView from './subscribe/views/SubscribeFormView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
  stripeKey: 'pk_test_5AVvhyJrg3yIEnWSMQVBl3mQ00mK2D2SOD',
});

renderWidget('donate-widget', <DonateWidget />);
