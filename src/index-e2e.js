import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateWidget from './donate/views/DonateWidget';
import './index.css';

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
